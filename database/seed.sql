INSERT INTO schemes (
    name,
    description,
    benefits,
    required_documents,
    application_link,
    category
) VALUES

(
'PM-KISAN',
'Income support for eligible farmer families.',
'₹6,000 per year',
'["Aadhaar Card","Bank Passbook","Land Records"]',
'https://pmkisan.gov.in',
'Agriculture'
),

(
'Ayushman Bharat',
'Health insurance for eligible families.',
'Health coverage up to ₹5 lakh per family per year',
'["Aadhaar Card","Ration Card"]',
'https://beneficiary.nha.gov.in',
'Healthcare'
),

(
'PMAY',
'Financial assistance for affordable housing.',
'Subsidy for house construction',
'["Aadhaar Card","Income Certificate","Property Documents"]',
'https://pmaymis.gov.in',
'Housing'
),

(
'National Scholarship',
'Scholarship for eligible students.',
'Financial support for education',
'["Aadhaar Card","Income Certificate","Bonafide Certificate"]',
'https://scholarships.gov.in',
'Education'
),

(
'Pradhan Mantri Mudra Yojana',
'Loans for small businesses.',
'Business loan up to ₹10 lakh',
'["Aadhaar Card","PAN Card","Business Proof"]',
'https://www.mudra.org.in',
'Business'
);

INSERT INTO eligibility_rules (
scheme_id,
min_age,
max_age,
max_income,
gender,
state,
occupation,
student,
farmer,
disability
)

VALUES

(1,18,NULL,500000,'Any','Any','Farmer',0,1,0),

(2,0,NULL,500000,'Any','Any','Any',0,0,0),

(3,18,NULL,300000,'Any','Any','Any',0,0,0),

(4,16,30,300000,'Any','Any','Student',1,0,0),

(5,18,NULL,NULL,'Any','Any','Business',0,0,0);