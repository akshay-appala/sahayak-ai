const db = require("../config/database");
const { explainSchemes } = require("./ai/recommendationService");

async function checkEligibility(req, res) {
  let { age, income, gender, state, occupation, student, farmer, disability } =
    req.body;

  age = Number(age);
  income = Number(income);

  gender = (gender || "").trim().toLowerCase();
  state = (state || "").trim().toLowerCase();
  occupation = (occupation || "").trim().toLowerCase();

  student = Number(student);
  farmer = Number(farmer);
  disability = Number(disability);

  const sql = `
    SELECT s.*
    FROM schemes s
    JOIN eligibility_rules e
      ON s.id = e.scheme_id
    WHERE
      (e.min_age IS NULL OR ? >= e.min_age)
      AND (e.max_age IS NULL OR ? <= e.max_age)
      AND (e.max_income IS NULL OR ? <= e.max_income)
      AND (LOWER(e.gender) = 'any' OR LOWER(e.gender) = ?)
      AND (LOWER(e.state) = 'any' OR LOWER(e.state) = ?)
      AND (LOWER(e.occupation) = 'any' OR LOWER(e.occupation) = ?)
      AND (e.student IS NULL OR e.student = ?)
      AND (e.farmer IS NULL OR e.farmer = ?)
      AND (e.disability IS NULL OR e.disability = ?);
  `;

  db.all(
    sql,
    [age, age, income, gender, state, occupation, student, farmer, disability],
    async (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      rows.forEach((scheme) => {
        try {
          scheme.required_documents = JSON.parse(scheme.required_documents);
        } catch {
          scheme.required_documents = [];
        }
      });

      // Don't call Gemini if no schemes are found
      if (rows.length === 0) {
        return res.json({
          success: true,
          totalSchemes: 0,
          schemes: [],
          aiRecommendation:
            "No eligible government schemes were found for the given profile.",
        });
      }

      try {
        const aiRecommendation = await explainSchemes(req.body, rows);

        res.json({
          success: true,
          totalSchemes: rows.length,
          schemes: rows,
          aiRecommendation,
        });
      } catch (error) {
        console.log("Gemini API unavailable. Using fallback recommendation.");

        res.json({
          success: true,
          totalSchemes: rows.length,
          schemes: rows,
          aiRecommendation: `
              # AI Recommendation

              AI recommendations are temporarily unavailable.

              Based on your profile, the schemes listed above match your eligibility.

              Please review their benefits, required documents, and official application links.
            `,
        });
      }
    },
  );
}

function getAllSchemes(req, res) {
  db.all("SELECT * FROM schemes ORDER BY name", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    rows.forEach((scheme) => {
      try {
        scheme.required_documents = JSON.parse(scheme.required_documents);
      } catch {
        scheme.required_documents = [];
      }
    });

    res.json({
      success: true,
      totalSchemes: rows.length,
      schemes: rows,
    });
  });
}

module.exports = {
  checkEligibility,
  getAllSchemes,
};
