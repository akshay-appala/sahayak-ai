-- SahayakAI seed.sql
DELETE FROM eligibility_rules;
DELETE FROM schemes;

INSERT INTO schemes (id,name,description,benefits,required_documents,application_link,category) VALUES
(1,'PM-KISAN','Income support for eligible farmer families.','₹6,000 per year','["Aadhaar Card","Bank Passbook","Land Records","Mobile Number","e-KYC"]','https://pmkisan.gov.in','Agriculture'),
(2,'Ayushman Bharat (PM-JAY)','Health insurance scheme.','Health coverage up to ₹5 lakh per family','["Aadhaar Card","Ration Card","Mobile Number"]','https://beneficiary.nha.gov.in','Healthcare'),
(3,'PM Awas Yojana','Affordable housing assistance.','Housing subsidy','["Aadhaar Card","Income Certificate","Address Proof","Bank Passbook","Property Documents"]','https://pmaymis.gov.in','Housing'),
(4,'National Scholarship Portal','Scholarships for students.','Financial assistance for education','["Aadhaar Card","Income Certificate","Bonafide Certificate","Previous Marksheet","Bank Passbook"]','https://scholarships.gov.in','Education'),
(5,'PM Mudra Yojana','Business loan scheme.','Loan up to ₹10 lakh','["Aadhaar Card","PAN Card","Address Proof","Business Proof","Bank Passbook"]','https://www.mudra.org.in','Business'),
(6,'PM Ujjwala Yojana','LPG connection assistance.','Free LPG connection','["Aadhaar Card","Ration Card","Bank Passbook"]','https://www.pmuy.gov.in','Energy'),
(7,'Sukanya Samriddhi Yojana','Savings scheme for girl child.','High-interest savings','["Birth Certificate","Aadhaar Card","Parent ID","Photograph"]','https://www.indiapost.gov.in','Women & Child'),
(8,'Atal Pension Yojana','Pension scheme.','Guaranteed pension','["Aadhaar Card","Bank Passbook","Mobile Number"]','https://enps.nsdl.com','Pension'),
(9,'PM SVANidhi','Loan for street vendors.','Working capital loan','["Aadhaar Card","Vendor Certificate","Bank Passbook"]','https://pmsvanidhi.mohua.gov.in','Business'),
(10,'PM Jan Dhan Yojana','Financial inclusion scheme.','Zero-balance bank account','["Aadhaar Card","Address Proof","Photograph"]','https://pmjdy.gov.in','Banking');

INSERT INTO eligibility_rules (scheme_id,min_age,max_age,max_income,gender,state,occupation,student,farmer,disability) VALUES
(1,18,NULL,500000,'any','any','farmer',NULL,1,NULL),
(2,NULL,NULL,NULL,'any','any','any',NULL,NULL,NULL),
(3,18,NULL,300000,'any','any','any',NULL,NULL,NULL),
(4,16,30,300000,'any','any','student',1,NULL,NULL),
(5,18,NULL,NULL,'any','any','business',NULL,NULL,NULL),
(6,18,NULL,300000,'female','any','any',NULL,NULL,NULL),
(7,0,10,NULL,'female','any','any',NULL,NULL,NULL),
(8,18,40,NULL,'any','any','any',NULL,NULL,NULL),
(9,18,NULL,NULL,'any','any','street vendor',NULL,NULL,NULL),
(10,10,NULL,NULL,'any','any','any',NULL,NULL,NULL);