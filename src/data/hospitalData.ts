import { Department, Doctor, MedicalRecord, Prescription, VitalRecord, PatientUser } from '../types/hospital';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology & Heart Center',
    tagline: 'Pioneering cardiovascular treatments with world-class catheterization labs.',
    description: 'Our comprehensive Cardiology Department provides comprehensive preventive, diagnostic, and surgical cardiac interventions. Equipped with state-of-the-art 3D echocardiography, hybrid cardiac catheterization suites, and electrophysiology labs.',
    iconName: 'HeartPulse',
    headOfDepartment: 'Dr. Arthur Sterling, MD, FACC',
    floor: 'Building A, 3rd Floor',
    phoneExtension: 'Ext. 3100',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    keyServices: [
      'Coronary Angioplasty & Stenting',
      'Electrophysiology & Arrhythmia Ablation',
      'Heart Failure & Ventricular Assist Program',
      'TAVR & Minimally Invasive Valve Repair',
      'Preventive Cardiovascular Risk Screening'
    ],
    commonConditions: ['Coronary Artery Disease', 'Atrial Fibrillation', 'Heart Failure', 'Hypertension', 'Valvular Disease'],
    technologies: ['Siemens Artis Pheno Angiography', 'Philips EPIQ CVxi 3D Ultrasound', 'Cryoablation Catheters']
  },
  {
    id: 'neurology',
    name: 'Neurology & Neurosurgery',
    tagline: 'Advanced brain and spine care powered by precision neuronavigation.',
    description: 'LifeWell Neurological Institute combines neurosurgical mastery, comprehensive stroke care, and specialized cognitive disorder therapies. Our Comprehensive Stroke Center boasts door-to-needle times under 24 minutes.',
    iconName: 'Brain',
    headOfDepartment: 'Dr. Evelyn Morales, MD, PhD, FAANS',
    floor: 'Building B, 4th Floor',
    phoneExtension: 'Ext. 4200',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    keyServices: [
      'Minimally Invasive Spine Surgery',
      'Endovascular Stroke Rescue 24/7',
      'Epilepsy Monitoring & Resection',
      'Deep Brain Stimulation (DBS) for Parkinson\'s',
      'Neuro-Oncology & Skull Base Tumors'
    ],
    commonConditions: ['Acute Ischemic Stroke', 'Brain Tumors', 'Herniated Discs & Sciatica', 'Parkinson\'s Disease', 'Epilepsy'],
    technologies: ['Medtronic StealthStation S8', '3T Ultra-High Field MRI', 'Intraoperative Neuromonitoring']
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics & Joint Reconstruction',
    tagline: 'Restoring mobility and performance with robotic-assisted surgery.',
    description: 'From sports injuries in elite athletes to joint replacements and complex spinal trauma, our orthopedic team utilizes robotic navigation to ensure rapid recovery and lasting joint longevity.',
    iconName: 'Activity',
    headOfDepartment: 'Dr. James Callaghan, MD, FAAOS',
    floor: 'Building A, 2nd Floor',
    phoneExtension: 'Ext. 2400',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    keyServices: [
      'Mako Robotic Total Knee & Hip Replacement',
      'Arthroscopic Rotator Cuff & ACL Repair',
      'Sports Medicine & Platelet-Rich Plasma (PRP)',
      'Pediatric Orthopedic Deformity Correction',
      'Accelerated Joint Recovery Pathway'
    ],
    commonConditions: ['Osteoarthritis', 'ACL & Meniscus Tears', 'Rotator Cuff Pathology', 'Carpal Tunnel', 'Spinal Stenosis'],
    technologies: ['Mako SmartRobotics System', 'High-Resolution Dynamic Musculoskeletal Ultrasound', 'C-Arm Fluoroscopy']
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics & Neonatal Care',
    tagline: 'Gentle, specialized medicine designed specifically for growing children.',
    description: 'Dedicated to children from birth through adolescence. Featuring a Level III Neonatal Intensive Care Unit (NICU), child-friendly private suites, and compassionate pediatric subspecialists.',
    iconName: 'Baby',
    headOfDepartment: 'Dr. Maya Lin-Siddiqui, MD, FAAP',
    floor: 'Building C, 1st & 2nd Floors',
    phoneExtension: 'Ext. 1500',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    keyServices: [
      'Comprehensive Well-Child Wellness Exams',
      'Level III Neonatal Intensive Care (NICU)',
      'Pediatric Asthma & Allergy Management',
      'Childhood Immunization & Developmental Screening',
      'Pediatric Urgent Care 24/7'
    ],
    commonConditions: ['Pediatric Asthma', 'Type 1 Diabetes', 'Developmental Delays', 'Severe Respiratory Infections', 'Prematurity'],
    technologies: ['Giraffe Omnibed Incubators', 'Pediatric Dedicated Low-Dose CT', 'Gentle-Draw Micro-Sampling Lab']
  },
  {
    id: 'oncology',
    name: 'Comprehensive Cancer Center',
    tagline: 'Targeted immunotherapies, precision oncology, and holistic survivorship.',
    description: 'Our Commission on Cancer (CoC) accredited center integrates genomic tumor profiling, outpatient infusion suites, radiation oncology, and psycho-oncology support under one roof.',
    iconName: 'ShieldAlert',
    headOfDepartment: 'Dr. Robert Hensley, MD, FACP',
    floor: 'Cancer Pavilion, Floors 1-3',
    phoneExtension: 'Ext. 5100',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    keyServices: [
      'Next-Gen Genomic Tumor Sequencing',
      'Immunotherapy & Targeted Biological Infusions',
      'Stereotactic Body Radiation Therapy (SBRT)',
      'Surgical Oncology Tumor Resection',
      'Integrative Palliative & Nutrition Counseling'
    ],
    commonConditions: ['Breast Cancer', 'Lung Carcinoma', 'Colorectal Malignancy', 'Lymphoma & Leukemia', 'Prostate Cancer'],
    technologies: ['Varian TrueBeam Radiosurgery System', 'Oncology Precision Genomic Sequencer', 'Cooling Cap Scalp Preservation']
  },
  {
    id: 'emergency',
    name: 'Emergency & Trauma Care',
    tagline: 'Certified Level 1 Emergency response around the clock, 365 days a year.',
    description: 'Equipped with direct rooftop helipad access, dedicated trauma resuscitation bays, point-of-care rapid diagnostics, and immediate round-the-clock surgeon dispatch.',
    iconName: 'Siren',
    headOfDepartment: 'Dr. Kendra Washington, MD, FACEP',
    floor: 'Ground Floor, North Wing',
    phoneExtension: 'Ext. 9110 / Direct Line: 911',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    keyServices: [
      'Level 1 Certified Adult & Pediatric Trauma',
      'Rapid Resuscitation Suites & Shock Trauma',
      'Dedicated Chest Pain & Stroke Fast-Track',
      'Toxicology & Burn Stabilization Units',
      'Rooftop Medevac Helipad'
    ],
    commonConditions: ['Multiple Trauma & Accidents', 'Cardiac Arrest', 'Severe Bleeding & Burns', 'Anaphylaxis', 'Sepsis'],
    technologies: ['Sonosite Point-of-Care Ultrasound (POCUS)', 'Rapid Thromboelastography (TEG)', 'Lucas Mechanical CPR']
  },
  {
    id: 'womens-health',
    name: "Women's Health & Maternity",
    tagline: 'Empowering women with compassionate obstetric, gynecologic, and fertility care.',
    description: 'From luxury family birth suites with hydrotherapy tubs to advanced robotic pelvic surgery and menopausal hormone medicine, our center is built to support women through every chapter.',
    iconName: 'Flower2',
    headOfDepartment: 'Dr. Nadia Farooq, MD, FACOG',
    floor: 'Building B, 2nd Floor',
    phoneExtension: 'Ext. 2800',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
    keyServices: [
      'High-Risk Maternal-Fetal Medicine',
      'Private Family Birthing Suites',
      'Robotic Myomectomy & Endometriosis Excision',
      'Fertility Preservation & Reproductive Endocrinology',
      '3D Mammography & Breast Health'
    ],
    commonConditions: ['High-Risk Pregnancies', 'Endometriosis', 'Uterine Fibroids', 'Polycystic Ovary Syndrome (PCOS)', 'Pelvic Organ Prolapse'],
    technologies: ['Hologic 3D Genius Mammography', 'GE Voluson E10 4D Obstetric Ultrasound', 'da Vinci Xi Surgical Console']
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology & Digestive Health',
    tagline: 'Advanced diagnostic endoscopy, hepatology, and microbiome science.',
    description: 'Providing comprehensive care for complex gastrointestinal disorders, liver diseases, inflammatory bowel disease (IBD), and non-invasive endoscopic therapies.',
    iconName: 'Stethoscope',
    headOfDepartment: 'Dr. Marcus Vance, MD, FACG',
    floor: 'Building A, 1st Floor',
    phoneExtension: 'Ext. 1900',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80',
    keyServices: [
      'High-Definition Colonoscopy & Polypectomy',
      'Endoscopic Ultrasound (EUS) & ERCP',
      'Comprehensive Crohn\'s & Colitis Clinic',
      'Fatty Liver (NASH) & Viral Hepatitis Center',
      'Esophageal Motility & Bravo pH Capsule'
    ],
    commonConditions: ['Gastroesophageal Reflux (GERD)', 'Ulcerative Colitis', 'Irritable Bowel Syndrome', 'Gallstones', 'Celiac Disease'],
    technologies: ['Olympus EVIS X1 Endoscopy System', 'FibroScan Liver Elastography', 'PillCam SB3 Capsule Endoscopy']
  }
];

export const DOCTORS: Doctor[] = [
  // CARDIOLOGY (3 Doctors)
  {
    id: 'doc-cardio-1',
    name: 'Dr. Arthur Sterling',
    title: 'MD, FACC - Chief of Cardiovascular Sciences',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Heart Center',
    specialties: ['Interventional Cardiology', 'Complex Coronary Interventions', 'TAVR'],
    education: 'Harvard Medical School • Johns Hopkins Fellowship',
    experienceYears: 24,
    rating: 4.95,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Sterling has pioneered minimally invasive transcatheter valve replacement procedures for over two decades. He has published over 80 peer-reviewed articles on cardiac catheterization.',
    availableDays: ['Monday', 'Wednesday', 'Thursday'],
    languages: ['English', 'German'],
    consultationFee: 240,
    acceptingNewPatients: true,
    officeLocation: 'Suite A-301',
    awards: ['Top Doctor 2024 New York Metro', 'AHA Outstanding Clinical Investigator']
  },
  {
    id: 'doc-cardio-2',
    name: 'Dr. Elena Rostova',
    title: 'MD, FHRS - Director of Cardiac Electrophysiology',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Heart Center',
    specialties: ['Heart Rhythm Disorders', 'Radiofrequency Ablation', 'Pacemaker & ICD Implants'],
    education: 'Columbia University Vagelos College of Physicians and Surgeons',
    experienceYears: 16,
    rating: 4.91,
    reviewCount: 228,
    image: 'https://images.unsplash.com/photo-1594824813583-4a6f7b9cf41d?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Rostova specializes in the diagnosis and surgical treatment of complex ventricular and atrial arrhythmias. She is a dedicated advocate for female cardiovascular health.',
    availableDays: ['Tuesday', 'Wednesday', 'Friday'],
    languages: ['English', 'Russian'],
    consultationFee: 220,
    acceptingNewPatients: true,
    officeLocation: 'Suite A-304',
    awards: ['Pacesetter Research Fellow', 'Distinguished Clinician Award']
  },
  {
    id: 'doc-cardio-3',
    name: 'Dr. Julian Thorne',
    title: 'MD - Preventive Cardiologist & Heart Failure Specialist',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Heart Center',
    specialties: ['Heart Failure Management', 'Preventive Lipidology', 'Echocardiography'],
    education: 'Stanford University School of Medicine',
    experienceYears: 11,
    rating: 4.88,
    reviewCount: 174,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Thorne guides patients through metabolic risk reduction, advanced lipid therapies, and non-invasive early heart disease identification through AI-enhanced echocardiography.',
    availableDays: ['Monday', 'Tuesday', 'Friday'],
    languages: ['English', 'Spanish'],
    consultationFee: 190,
    acceptingNewPatients: true,
    officeLocation: 'Suite A-308'
  },

  // NEUROLOGY (3 Doctors)
  {
    id: 'doc-neuro-1',
    name: 'Dr. Evelyn Morales',
    title: 'MD, PhD, FAANS - Chief of Neurosurgery',
    departmentId: 'neurology',
    departmentName: 'Neurology & Neurosurgery',
    specialties: ['Complex Spine Reconstruction', 'Intracranial Aneurysms', 'Acoustic Neuroma'],
    education: 'Johns Hopkins School of Medicine • UCSF Neurosurgery Residency',
    experienceYears: 20,
    rating: 4.97,
    reviewCount: 289,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bio: 'Internationally recognized for her precision microsurgical techniques in delicate brain stem and spinal cord lesions. Pioneer in minimally invasive awake craniotomy.',
    availableDays: ['Monday', 'Thursday'],
    languages: ['English', 'Spanish'],
    consultationFee: 260,
    acceptingNewPatients: true,
    officeLocation: 'Suite B-402',
    awards: ['CNS Excellence in Surgical Science', 'Castle Connolly Top Doctor']
  },
  {
    id: 'doc-neuro-2',
    name: 'Dr. Tariq Al-Mansoor',
    title: 'MD - Director of Comprehensive Stroke Service',
    departmentId: 'neurology',
    departmentName: 'Neurology & Neurosurgery',
    specialties: ['Vascular Neurology', 'Endovascular Stroke Rescue', 'Cerebrovascular Disease'],
    education: 'Mayo Clinic College of Medicine and Science',
    experienceYears: 14,
    rating: 4.92,
    reviewCount: 198,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Al-Mansoor leads emergency neurovascular interventions for acute ischemic and hemorrhagic strokes, maintaining one of the highest rapid recovery success records on the East Coast.',
    availableDays: ['Tuesday', 'Wednesday', 'Friday'],
    languages: ['English', 'Arabic'],
    consultationFee: 210,
    acceptingNewPatients: true,
    officeLocation: 'Suite B-406'
  },
  {
    id: 'doc-neuro-3',
    name: 'Dr. Chloe Arisawa',
    title: 'MD, PhD - Cognitive Neurologist & Movement Disorder Specialist',
    departmentId: 'neurology',
    departmentName: 'Neurology & Neurosurgery',
    specialties: ['Parkinson\'s Disease', 'Memory & Alzheimer\'s Care', 'Deep Brain Stimulation'],
    education: 'Penn Medicine • National Institutes of Health (NIH) Clinical Fellow',
    experienceYears: 12,
    rating: 4.89,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1594824813583-4a6f7b9cf41d?auto=format&fit=crop&w=600&q=80',
    bio: 'Specializing in neurodegenerative disorders and deep brain stimulation programming. Dr. Arisawa emphasizes multidisciplinary care uniting physical therapy and family counseling.',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    languages: ['English', 'Japanese'],
    consultationFee: 200,
    acceptingNewPatients: true,
    officeLocation: 'Suite B-410'
  },

  // ORTHOPEDICS (3 Doctors)
  {
    id: 'doc-ortho-1',
    name: 'Dr. James Callaghan',
    title: 'MD, FAAOS - Director of Joint Replacement',
    departmentId: 'orthopedics',
    departmentName: 'Orthopedics & Joint Reconstruction',
    specialties: ['Robotic Hip & Knee Arthroplasty', 'Revision Joint Replacement', 'Rapid Recovery'],
    education: 'Cornell University Weill Cornell Medicine • Hospital for Special Surgery',
    experienceYears: 22,
    rating: 4.96,
    reviewCount: 345,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Callaghan has performed over 4,500 successful robotic joint replacements. He is a primary consultant for kinematic alignment technology in knee implants.',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday'],
    languages: ['English'],
    consultationFee: 230,
    acceptingNewPatients: true,
    officeLocation: 'Suite A-201',
    awards: ['Master Orthopedic Surgeon Award', 'Patient Choice 5-Star Honor Roll']
  },
  {
    id: 'doc-ortho-2',
    name: 'Dr. Maya Patel',
    title: 'MD - Sports Medicine & Shoulder/Elbow Surgeon',
    departmentId: 'orthopedics',
    departmentName: 'Orthopedics & Joint Reconstruction',
    specialties: ['Arthroscopic Rotator Cuff Repair', 'ACL Reconstruction', 'Biologics & PRP'],
    education: 'Duke University School of Medicine • Steadman Clinic Fellowship',
    experienceYears: 13,
    rating: 4.93,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80',
    bio: 'Team physician for collegiate athletes, Dr. Patel specializes in joint-sparing arthroscopic procedures designed to return patients to high-level athletics and active lifestyles.',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    languages: ['English', 'Hindi', 'Gujarati'],
    consultationFee: 205,
    acceptingNewPatients: true,
    officeLocation: 'Suite A-205'
  },
  {
    id: 'doc-ortho-3',
    name: 'Dr. Lucas Tremblay',
    title: 'MD - Orthopedic Spine & Scoliosis Specialist',
    departmentId: 'orthopedics',
    departmentName: 'Orthopedics & Joint Reconstruction',
    specialties: ['Minimally Invasive Spine Surgery', 'Adult Spinal Deformity', 'Microdiscectomy'],
    education: 'McGill University Faculty of Medicine • Cleveland Clinic Fellowship',
    experienceYears: 15,
    rating: 4.88,
    reviewCount: 167,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    bio: 'Focuses on non-fusion alternatives and micro-endoscopic decompression for patients suffering from chronic disc herniation, sciatica, and cervical spine pain.',
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
    languages: ['English', 'French'],
    consultationFee: 225,
    acceptingNewPatients: true,
    officeLocation: 'Suite A-209'
  },

  // PEDIATRICS (2 Doctors)
  {
    id: 'doc-ped-1',
    name: 'Dr. Maya Lin-Siddiqui',
    title: 'MD, FAAP - Chief of Pediatric Medicine',
    departmentId: 'pediatrics',
    departmentName: 'Pediatrics & Neonatal Care',
    specialties: ['General Pediatrics', 'Neonatal Care', 'Pediatric Pulmonology'],
    education: 'Yale School of Medicine • Boston Children\'s Hospital Residency',
    experienceYears: 18,
    rating: 4.98,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1594824813583-4a6f7b9cf41d?auto=format&fit=crop&w=600&q=80',
    bio: 'Beloved by thousands of families for her warm bedside manner, Dr. Lin-Siddiqui ensures parents feel confident, heard, and supported from newborn checkups through adolescence.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    languages: ['English', 'Mandarin'],
    consultationFee: 175,
    acceptingNewPatients: true,
    officeLocation: 'Suite C-101',
    awards: ['Top Pediatrician Award', 'Child Advocacy Champion']
  },
  {
    id: 'doc-ped-2',
    name: 'Dr. Samuel O\'Connor',
    title: 'MD - Pediatric Emergency & Adolescent Specialist',
    departmentId: 'pediatrics',
    departmentName: 'Pediatrics & Neonatal Care',
    specialties: ['Pediatric Urgent Care', 'Allergies & Asthma', 'Adolescent Medicine'],
    education: 'Northwestern University Feinberg School of Medicine',
    experienceYears: 10,
    rating: 4.91,
    reviewCount: 184,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. O\'Connor brings calm, reassuring clarity to anxious children and parents during acute infections, fractures, and severe allergic reactions.',
    availableDays: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
    languages: ['English'],
    consultationFee: 165,
    acceptingNewPatients: true,
    officeLocation: 'Suite C-105'
  },

  // ONCOLOGY (2 Doctors)
  {
    id: 'doc-onco-1',
    name: 'Dr. Robert Hensley',
    title: 'MD, FACP - Medical Director of Cancer Center',
    departmentId: 'oncology',
    departmentName: 'Comprehensive Cancer Center',
    specialties: ['Genomic Targeted Therapy', 'Breast & Lung Oncology', 'Immunotherapy'],
    education: 'Memorial Sloan Kettering Cancer Center • Harvard Medical School',
    experienceYears: 23,
    rating: 4.94,
    reviewCount: 260,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Hensley matches patients to next-generation biological therapies based on deep genomic sequencing, spearheading groundbreaking clinical trials with dignity and warmth.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday'],
    languages: ['English'],
    consultationFee: 250,
    acceptingNewPatients: true,
    officeLocation: 'Cancer Pavilion 201',
    awards: ['National Oncology Leadership Medal', 'Distinguished Clinical Investigator']
  },
  {
    id: 'doc-onco-2',
    name: 'Dr. Priya Sundaram',
    title: 'MD - Radiation Oncologist & Radiosurgery Specialist',
    departmentId: 'oncology',
    departmentName: 'Comprehensive Cancer Center',
    specialties: ['Stereotactic Radiosurgery (SRS/SBRT)', 'Brachytherapy', 'CNS Tumors'],
    education: 'Stanford University Medical Center Residency',
    experienceYears: 14,
    rating: 4.90,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Sundaram utilizes sub-millimeter targeted radiation to destroy tumors while completely preserving surrounding healthy organ tissue.',
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
    languages: ['English', 'Tamil'],
    consultationFee: 235,
    acceptingNewPatients: true,
    officeLocation: 'Cancer Pavilion LL-12'
  },

  // EMERGENCY MEDICINE (2 Doctors)
  {
    id: 'doc-er-1',
    name: 'Dr. Kendra Washington',
    title: 'MD, FACEP - Chair of Emergency Medicine',
    departmentId: 'emergency',
    departmentName: 'Emergency & Trauma Care',
    specialties: ['Trauma Resuscitation', 'Point-of-Care Ultrasound', 'Disaster Medicine'],
    education: 'Emory University School of Medicine • Bellevue Hospital Trauma Fellowship',
    experienceYears: 19,
    rating: 4.96,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1594824813583-4a6f7b9cf41d?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Washington oversees LifeWell\'s Level 1 Trauma Center, coordinating rapid clinical response teams that save thousands of critical lives annually.',
    availableDays: ['Monday', 'Tuesday', 'Friday', 'Sunday'],
    languages: ['English'],
    consultationFee: 180,
    acceptingNewPatients: true,
    officeLocation: 'Trauma Bay Alpha',
    awards: ['Emergency Physician of the Year', 'EMS Medical Director Leadership Award']
  },
  {
    id: 'doc-er-2',
    name: 'Dr. Daniel Zhang',
    title: 'MD - Emergency Medicine & Critical Care Physician',
    departmentId: 'emergency',
    departmentName: 'Emergency & Trauma Care',
    specialties: ['Cardiopulmonary Resuscitation', 'Acute Toxic Exposure', 'Airway Management'],
    education: 'University of Michigan Medical School',
    experienceYears: 11,
    rating: 4.89,
    reviewCount: 189,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    bio: 'Specialist in rapid stabilization of acute cardiovascular collapse, severe respiratory distress, and septic shock protocols.',
    availableDays: ['Wednesday', 'Thursday', 'Saturday'],
    languages: ['English', 'Mandarin'],
    consultationFee: 175,
    acceptingNewPatients: true,
    officeLocation: 'Trauma Bay Beta'
  },

  // WOMEN'S HEALTH (2 Doctors)
  {
    id: 'doc-wh-1',
    name: 'Dr. Nadia Farooq',
    title: 'MD, FACOG - Director of Women\'s Health & Obstetrics',
    departmentId: 'womens-health',
    departmentName: 'Women\'s Health & Maternity',
    specialties: ['High-Risk Obstetrics', 'da Vinci Robotic Surgery', 'Endometriosis'],
    education: 'University of Pennsylvania Perelman School of Medicine',
    experienceYears: 17,
    rating: 4.97,
    reviewCount: 380,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bio: 'Passionate about maternal dignity and minimally invasive surgical solutions for pelvic pain, fibroids, and complicated pregnancies.',
    availableDays: ['Monday', 'Wednesday', 'Thursday'],
    languages: ['English', 'Urdu'],
    consultationFee: 215,
    acceptingNewPatients: true,
    officeLocation: 'Suite B-201',
    awards: ['Compassionate Doctor Recognition', 'Excellence in Gynecologic Surgery']
  },
  {
    id: 'doc-wh-2',
    name: 'Dr. Rachel Greenbaum',
    title: 'MD - Maternal-Fetal Medicine Specialist',
    departmentId: 'womens-health',
    departmentName: 'Women\'s Health & Maternity',
    specialties: ['Fetal Echocardiography', 'Multiple Gestations', 'Prenatal Genetics'],
    education: 'Tufts University School of Medicine • Brigham and Women\'s Fellowship',
    experienceYears: 13,
    rating: 4.92,
    reviewCount: 205,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Greenbaum guides expecting mothers through complex medical conditions, gestational diabetes, and prenatal diagnostics with deep empathy and scientific rigor.',
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
    languages: ['English', 'Hebrew'],
    consultationFee: 225,
    acceptingNewPatients: true,
    officeLocation: 'Suite B-205'
  },

  // GASTROENTEROLOGY (2 Doctors)
  {
    id: 'doc-gastro-1',
    name: 'Dr. Marcus Vance',
    title: 'MD, FACG - Chief of Gastroenterology',
    departmentId: 'gastroenterology',
    departmentName: 'Gastroenterology & Digestive Health',
    specialties: ['Advanced Therapeutic Endoscopy', 'IBD / Crohn\'s Disease', 'Pancreatobiliary Disorders'],
    education: 'Georgetown University School of Medicine • Mount Sinai Fellowship',
    experienceYears: 21,
    rating: 4.93,
    reviewCount: 275,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    bio: 'Specialist in non-surgical removal of complex gastrointestinal lesions and pioneering targeted biologic therapies for Crohn\'s disease and ulcerative colitis.',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    languages: ['English'],
    consultationFee: 210,
    acceptingNewPatients: true,
    officeLocation: 'Suite A-102',
    awards: ['ACG Master Clinician Fellow']
  },
  {
    id: 'doc-gastro-2',
    name: 'Dr. Sunita Kapoor',
    title: 'MD - Hepatology & Digestive Wellness',
    departmentId: 'gastroenterology',
    departmentName: 'Gastroenterology & Digestive Health',
    specialties: ['Fatty Liver Disease (NASH)', 'GERD & Motility', 'Microbiome Nutrition'],
    education: 'Baylor College of Medicine',
    experienceYears: 12,
    rating: 4.90,
    reviewCount: 165,
    image: 'https://images.unsplash.com/photo-1594824813583-4a6f7b9cf41d?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Kapoor focuses on holistic digestive health, metabolic liver conditions, and personalized nutritional medicine that heals the gut-brain axis.',
    availableDays: ['Wednesday', 'Thursday', 'Friday'],
    languages: ['English', 'Hindi'],
    consultationFee: 195,
    acceptingNewPatients: true,
    officeLocation: 'Suite A-108'
  }
];

// Demo patient user profile for instant testing in Patient Portal
export const DEMO_PATIENTS: { [key: string]: { user: PatientUser; records: MedicalRecord[]; prescriptions: Prescription[]; vitals: VitalRecord[] } } = {
  'elena@lifewell.demo': {
    user: {
      id: 'LW-8821',
      name: 'Elena Vance',
      email: 'elena@lifewell.demo',
      phone: '+1 (555) 234-8901',
      dob: '1984-04-12',
      gender: 'Female',
      bloodType: 'O Positive (O+)',
      allergies: ['Penicillin', 'Sulfa Antibiotics'],
      primaryDoctorId: 'doc-cardio-1',
      primaryDoctorName: 'Dr. Arthur Sterling, MD',
      insuranceId: 'BCBS-9948201A',
      insuranceName: 'BlueCross BlueShield Premier Choice',
      emergencyContact: {
        name: 'David Vance',
        relationship: 'Spouse',
        phone: '+1 (555) 234-8902'
      },
      memberSince: 'March 2021'
    },
    records: [
      {
        id: 'rec-101',
        date: '2026-08-15',
        type: 'Cardiology',
        title: 'Transthoracic 3D Echocardiogram',
        doctorName: 'Dr. Arthur Sterling',
        department: 'Cardiology & Heart Center',
        facility: 'LifeWell Cardiac Suite 3B',
        status: 'Normal',
        summary: 'Normal left ventricular systolic function with estimated ejection fraction of 62%. Normal wall motion. Mild aortic valve sclerosis without significant stenosis.',
        fileSize: '3.4 MB',
        keyValues: [
          { metric: 'Ejection Fraction', value: '62%', standardRange: '55 - 70%', status: 'optimal' },
          { metric: 'LV End-Diastolic Dimension', value: '4.6 cm', standardRange: '3.8 - 5.2 cm', status: 'normal' },
          { metric: 'Left Atrial Volume Index', value: '27 mL/m²', standardRange: '< 34 mL/m²', status: 'normal' }
        ]
      },
      {
        id: 'rec-102',
        date: '2026-07-28',
        type: 'Lab Test',
        title: 'Comprehensive Metabolic & Lipid Panel',
        doctorName: 'Dr. Julian Thorne',
        department: 'Cardiology & Heart Center',
        facility: 'LifeWell Central Laboratory',
        status: 'Normal',
        summary: 'Fasting lipid profile exhibits excellent therapeutic control under current statin regimen. Renal and hepatic markers within target safety windows.',
        fileSize: '1.2 MB',
        keyValues: [
          { metric: 'Total Cholesterol', value: '164 mg/dL', standardRange: '< 200 mg/dL', status: 'optimal' },
          { metric: 'LDL-C (Calculated)', value: '78 mg/dL', standardRange: '< 100 mg/dL', status: 'optimal' },
          { metric: 'HDL-C', value: '58 mg/dL', standardRange: '> 50 mg/dL', status: 'optimal' },
          { metric: 'Triglycerides', value: '112 mg/dL', standardRange: '< 150 mg/dL', status: 'normal' },
          { metric: 'Estimated GFR', value: '> 90 mL/min', standardRange: '> 60 mL/min', status: 'optimal' }
        ]
      },
      {
        id: 'rec-103',
        date: '2026-04-10',
        type: 'Imaging',
        title: 'Dual-Energy Spine & Hip Bone Density (DEXA)',
        doctorName: 'Dr. James Callaghan',
        department: 'Orthopedics & Joint Reconstruction',
        facility: 'LifeWell Diagnostic Imaging Hub',
        status: 'Normal',
        summary: 'Bone mineral density measurements confirm healthy bone mass without signs of osteopenia or structural thinning.',
        fileSize: '2.1 MB',
        keyValues: [
          { metric: 'Femoral Neck T-Score', value: '-0.3', standardRange: '> -1.0', status: 'optimal' },
          { metric: 'Lumbar Spine L1-L4 T-Score', value: '-0.1', standardRange: '> -1.0', status: 'optimal' }
        ]
      }
    ],
    prescriptions: [
      {
        id: 'rx-201',
        medicationName: 'Atorvastatin Calcium',
        dosage: '20 mg Oral Tablet',
        frequency: 'Once daily at bedtime',
        prescribedBy: 'Dr. Arthur Sterling',
        prescribedDate: '2026-01-14',
        endDate: '2027-01-14',
        refillsRemaining: 3,
        instructions: 'Take with or without food. Avoid excessive grapefruit consumption.',
        status: 'Active'
      },
      {
        id: 'rx-202',
        medicationName: 'Lisinopril',
        dosage: '10 mg Oral Tablet',
        frequency: 'Once daily in the morning',
        prescribedBy: 'Dr. Arthur Sterling',
        prescribedDate: '2026-02-02',
        endDate: '2027-02-02',
        refillsRemaining: 2,
        instructions: 'Monitor home blood pressure weekly. Stay adequately hydrated.',
        status: 'Active'
      },
      {
        id: 'rx-203',
        medicationName: 'Vitamin D3 (Cholecalciferol)',
        dosage: '2,000 IU Oral Capsule',
        frequency: 'Once daily with a meal',
        prescribedBy: 'Dr. Julian Thorne',
        prescribedDate: '2026-03-20',
        endDate: '2027-03-20',
        refillsRemaining: 5,
        instructions: 'Supports cardiovascular & bone density health.',
        status: 'Active'
      }
    ],
    vitals: [
      { id: 'vit-1', date: '2026-09-22', bloodPressure: '116/74', heartRate: 64, temperature: '98.4°F', oxygenSaturation: 99, bloodGlucose: 92, weightLbs: 138 },
      { id: 'vit-2', date: '2026-08-15', bloodPressure: '118/76', heartRate: 68, temperature: '98.6°F', oxygenSaturation: 99, bloodGlucose: 95, weightLbs: 139 },
      { id: 'vit-3', date: '2026-07-28', bloodPressure: '122/78', heartRate: 71, temperature: '98.7°F', oxygenSaturation: 98, bloodGlucose: 98, weightLbs: 140 },
      { id: 'vit-4', date: '2026-05-14', bloodPressure: '124/80', heartRate: 72, temperature: '98.5°F', oxygenSaturation: 99, bloodGlucose: 94, weightLbs: 141 }
    ]
  },
  'marcus@lifewell.demo': {
    user: {
      id: 'LW-4419',
      name: 'Marcus Brody',
      email: 'marcus@lifewell.demo',
      phone: '+1 (555) 778-9012',
      dob: '1976-11-23',
      gender: 'Male',
      bloodType: 'A Positive (A+)',
      allergies: ['Aspirin', 'Latex'],
      primaryDoctorId: 'doc-ortho-1',
      primaryDoctorName: 'Dr. James Callaghan, MD',
      insuranceId: 'AETNA-88129-C',
      insuranceName: 'Aetna Health Gold Network',
      emergencyContact: {
        name: 'Claire Brody',
        relationship: 'Sister',
        phone: '+1 (555) 778-9015'
      },
      memberSince: 'January 2023'
    },
    records: [
      {
        id: 'rec-201',
        date: '2026-09-02',
        type: 'Imaging',
        title: 'Post-Operative Right Knee Robotic Assessment X-Ray',
        doctorName: 'Dr. James Callaghan',
        department: 'Orthopedics & Joint Reconstruction',
        facility: 'LifeWell Orthopedic Wing',
        status: 'Normal',
        summary: 'Prosthetic alignment is anatomical and stable with excellent cement interface. No hardware loosening, effusion, or peri-prosthetic fracture.',
        fileSize: '4.8 MB',
        keyValues: [
          { metric: 'Tibiofemoral Alignment Angle', value: '5.8°', standardRange: '5 - 7°', status: 'optimal' },
          { metric: 'Range of Motion (Flexion)', value: '125°', standardRange: '> 110°', status: 'optimal' }
        ]
      }
    ],
    prescriptions: [
      {
        id: 'rx-301',
        medicationName: 'Meloxicam',
        dosage: '7.5 mg Oral Tablet',
        frequency: 'Once daily with breakfast',
        prescribedBy: 'Dr. James Callaghan',
        prescribedDate: '2026-08-10',
        endDate: '2026-11-10',
        refillsRemaining: 1,
        instructions: 'Take for joint inflammation control. Do not take with other NSAIDs.',
        status: 'Active'
      }
    ],
    vitals: [
      { id: 'vit-21', date: '2026-09-02', bloodPressure: '122/80', heartRate: 70, temperature: '98.6°F', oxygenSaturation: 98, bloodGlucose: 104, weightLbs: 182 }
    ]
  }
};

export const INITIAL_SAMPLE_APPOINTMENTS = [
  {
    id: 'apt-001',
    patientId: 'LW-8821',
    patientName: 'Elena Vance',
    patientEmail: 'elena@lifewell.demo',
    patientPhone: '+1 (555) 234-8901',
    doctorId: 'doc-cardio-1',
    doctorName: 'Dr. Arthur Sterling',
    doctorTitle: 'MD, FACC - Chief of Cardiovascular Sciences',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Heart Center',
    visitType: 'In-Person' as const,
    date: '2026-10-14',
    timeSlot: '10:30 AM',
    reason: 'Annual cardiac follow-up and echo review',
    insuranceProvider: 'BlueCross BlueShield',
    status: 'Confirmed' as const,
    createdAt: '2026-09-28T14:32:00Z',
    bookingRef: 'LW-2026-7842',
    notes: 'Please arrive 15 minutes early at Suite A-301 with current medication list.'
  },
  {
    id: 'apt-002',
    patientId: 'LW-8821',
    patientName: 'Elena Vance',
    patientEmail: 'elena@lifewell.demo',
    patientPhone: '+1 (555) 234-8901',
    doctorId: 'doc-wh-1',
    doctorName: 'Dr. Nadia Farooq',
    doctorTitle: 'MD, FACOG - Director of Women\'s Health',
    departmentId: 'womens-health',
    departmentName: "Women's Health & Maternity",
    visitType: 'Video Consultation' as const,
    date: '2026-10-28',
    timeSlot: '02:00 PM',
    reason: 'Telehealth follow-up on hormone therapy & wellness counseling',
    insuranceProvider: 'BlueCross BlueShield',
    status: 'Confirmed' as const,
    createdAt: '2026-09-29T09:15:00Z',
    bookingRef: 'LW-2026-8910',
    notes: 'Secure video link will be sent to email 30 mins before the appointment.'
  },
  {
    id: 'apt-003',
    patientId: 'LW-8821',
    patientName: 'Elena Vance',
    patientEmail: 'elena@lifewell.demo',
    patientPhone: '+1 (555) 234-8901',
    doctorId: 'doc-cardio-1',
    doctorName: 'Dr. Arthur Sterling',
    doctorTitle: 'MD, FACC',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Heart Center',
    visitType: 'In-Person' as const,
    date: '2026-08-15',
    timeSlot: '09:00 AM',
    reason: 'Routine 6-month checkup and 3D Echo reading',
    status: 'Completed' as const,
    createdAt: '2026-07-20T11:00:00Z',
    bookingRef: 'LW-2026-3104'
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'doctor' as const,
    senderName: 'Dr. Arthur Sterling',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Yesterday at 3:45 PM',
    text: 'Hello Elena, your lipid panel results from last week look exemplary. Your LDL is down to 78 mg/dL. Keep up your current daily dosage and morning walks!',
    isRead: true
  },
  {
    id: 'msg-2',
    sender: 'patient' as const,
    senderName: 'Elena Vance',
    timestamp: 'Yesterday at 4:10 PM',
    text: 'Thank you so much Dr. Sterling! Should I continue taking the Lisinopril 10mg as usual before our appointment on Oct 14th?',
    isRead: true
  },
  {
    id: 'msg-3',
    sender: 'doctor' as const,
    senderName: 'Dr. Arthur Sterling',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Today at 9:15 AM',
    text: 'Yes, absolutely continue your Lisinopril without interruption. We will check your blood pressure and review everything in person. Have a wonderful week!',
    isRead: false
  }
];

export const HOSPITAL_STATS = [
  { label: 'Board-Certified Specialists', value: '180+', icon: 'Stethoscope' },
  { label: 'Patient Satisfaction', value: '99.4%', icon: 'Smile' },
  { label: 'Annual Successful Procedures', value: '45,000+', icon: 'Award' },
  { label: 'Average ER Wait Time', value: '12 Mins', icon: 'Clock' }
];

export const FAQS = [
  {
    question: 'How do I book an appointment with a specialist?',
    answer: 'You can easily schedule an appointment using our 24/7 online booking portal on this website, or call our central scheduling line at (800) 555-WELL. You can filter by department, select your preferred doctor, and pick an immediate time slot.'
  },
  {
    question: 'How do I access my patient health records and lab results?',
    answer: 'Simply log into the secure LifeWell Patient Portal using the Patient Portal button in the top navigation. Once logged in, you can view your diagnostic reports, vitals timeline, active prescriptions, and request refills directly.'
  },
  {
    question: 'What health insurances are accepted at LifeWell Medical Center?',
    answer: 'LifeWell accepts all major commercial insurance providers including BlueCross BlueShield, Aetna, Cigna, UnitedHealthcare, Humana, as well as Medicare and Medicaid. We also offer transparent self-pay pricing.'
  },
  {
    question: 'Are telehealth / virtual video consultations available?',
    answer: 'Yes! When booking your appointment, simply select "Video Consultation" under Visit Type. You will receive a secure encrypted video link via SMS and email before your scheduled appointment.'
  },
  {
    question: 'What should I bring to my first appointment?',
    answer: 'Please bring a valid photo ID, your insurance card, a list of current medications and supplements, and any prior relevant diagnostic reports or CDs from previous healthcare providers.'
  }
];
