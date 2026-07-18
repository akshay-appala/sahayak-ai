const db = require("../config/database");
const { explainSchemes } = require("./ai/recommendationService");

async function getEligibleSchemes(userProfile) {
  let { age, income, gender, state, occupation, student, farmer, disability } =
    userProfile;

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

  return new Promise((resolve, reject) => {
    db.all(
      sql,
      [
        age,
        age,
        income,
        gender,
        state,
        occupation,
        student,
        farmer,
        disability,
      ],
      (err, rows) => {
        if (err) {
          return reject(err);
        }

        rows.forEach((scheme) => {
          try {
            scheme.required_documents = JSON.parse(scheme.required_documents);
          } catch {
            scheme.required_documents = [];
          }
        });

        resolve(rows);
      },
    );
  });
}

async function checkEligibility(req, res) {
  try {
    const rows = await getEligibleSchemes(req.body);

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
    } catch {
      res.json({
        success: true,
        totalSchemes: rows.length,
        schemes: rows,
        aiRecommendation: `
          AI recommendations are temporarily unavailable.

          Based on your profile, the schemes listed above match your eligibility.

          Please review their benefits, required documents, and official application links.
        `,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
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
