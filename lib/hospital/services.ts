/**
 * Services — Madni Specialist & Trauma Centre
 * -------------------------------------------------
 * Maps each department to its list of offered services.
 * Icon strings correspond to Lucide icon names resolved in DeptServices.tsx.
 *
 * ADDING A SERVICE:
 *   1. Find the relevant department entry below.
 *   2. Add a new service object to its services array.
 *   3. Choose an icon from the ICON_MAP in DeptServices.tsx (or add a new one).
 */

import type { Service } from './types'
import type { DepartmentId } from './types'

// ── Per-department service lists ──────────────────────────────

const CARDIOLOGY_SERVICES: Service[] = [
  { id: 'cardio-consult',   title: 'Cardiology Consultation',  icon: 'Stethoscope', description: 'Comprehensive assessment of cardiac symptoms, risk factors, and overall heart health.' },
  { id: 'bp-management',   title: 'Blood Pressure Management', icon: 'Gauge',       description: 'Diagnosis, monitoring, and treatment of hypertension and hypotension.' },
  { id: 'ecg',             title: 'ECG Interpretation',        icon: 'Activity',    description: 'Accurate reading and reporting of electrocardiogram results for arrhythmia detection.' },
  { id: 'heart-screening', title: 'Heart Disease Screening',   icon: 'Heart',       description: 'Early detection programmes for coronary artery disease and other cardiac conditions.' },
  { id: 'risk-assessment', title: 'Cardiac Risk Assessment',   icon: 'Shield',      description: 'Personalised evaluation of cardiovascular risk factors and prevention strategies.' },
  { id: 'chest-pain',      title: 'Chest Pain Evaluation',     icon: 'AlertCircle', description: 'Urgent and non-urgent assessment of chest pain to rule out serious cardiac causes.' },
  { id: 'cardiac-followup',title: 'Follow-up Cardiac Care',    icon: 'RefreshCcw',  description: 'Structured follow-up consultations to monitor and adjust ongoing cardiac treatment.' },
]

const ENT_SERVICES: Service[] = [
  { id: 'ear-infection',   title: 'Ear Infection Treatment',      icon: 'Volume2',    description: 'Diagnosis and treatment of acute and chronic ear infections including otitis media.' },
  { id: 'sinus-disease',   title: 'Sinus Disease Management',     icon: 'Wind',       description: 'Medical and minimally invasive treatment of sinusitis and related nasal conditions.' },
  { id: 'throat-disorders',title: 'Throat Disorders',             icon: 'Mic2',       description: 'Assessment and treatment of pharyngitis, laryngitis, and swallowing difficulties.' },
  { id: 'hearing-assess',  title: 'Hearing Assessment',           icon: 'Ear',        description: 'Clinical evaluation of hearing loss and referral for audiological testing when required.' },
  { id: 'allergy-ent',     title: 'Allergy-related ENT Conditions',icon: 'Flower2',   description: 'Management of allergic rhinitis, hay fever, and other allergy-driven ENT conditions.' },
  { id: 'tonsillitis',     title: 'Tonsillitis Treatment',        icon: 'Shield',     description: 'Medical management of acute and recurrent tonsillitis with surgical referral when indicated.' },
  { id: 'nasal-obstruction',title: 'Nasal Obstruction Evaluation',icon: 'Search',     description: 'Assessment of nasal blockage causes including polyps, deviated septum, and turbinate hypertrophy.' },
]

const ORTHOPEDICS_SERVICES: Service[] = [
  { id: 'joint-pain',      title: 'Joint Pain Management',        icon: 'Activity',   description: 'Comprehensive evaluation and treatment of acute and chronic joint pain in all major joints.' },
  { id: 'arthritis',       title: 'Arthritis Assessment',         icon: 'Search',     description: 'Diagnosis and management of osteoarthritis, rheumatoid arthritis, and other arthropathies.' },
  { id: 'fracture-mgmt',   title: 'Fracture Management',          icon: 'Bone',       description: 'Expert management of bone fractures including casting, bracing, and surgical referral.' },
  { id: 'back-pain',       title: 'Back Pain Evaluation',         icon: 'AlertCircle',description: 'Assessment of acute and chronic back pain with targeted treatment plans.' },
  { id: 'sports-injury',   title: 'Sports Injury Consultation',   icon: 'Dumbbell',   description: 'Specialist consultation for ligament tears, muscle injuries, and performance-related conditions.' },
  { id: 'bone-joint',      title: 'Bone and Joint Disorders',     icon: 'Shield',     description: 'Diagnosis and treatment of metabolic bone diseases, infections, and developmental conditions.' },
  { id: 'ortho-followup',  title: 'Orthopedic Follow-up Care',    icon: 'RefreshCcw', description: 'Post-treatment monitoring and rehabilitation planning after orthopedic procedures.' },
]

const PEDIATRICS_SERVICES: Service[] = [
  { id: 'diarrhoea',       title: 'Diarrhoea Treatment',          icon: 'Droplets',   description: 'Evidence-based management of acute and chronic diarrhoea with rehydration support.' },
  { id: 'typhoid',         title: 'Typhoid Management',           icon: 'Thermometer',description: 'Accurate diagnosis and antibiotic management of typhoid fever in children.' },
  { id: 'pneumonia',       title: 'Pneumonia Treatment',          icon: 'Wind',       description: 'Diagnosis and treatment of bacterial and viral pneumonia in paediatric patients.' },
  { id: 'vomiting-dehy',   title: 'Vomiting & Dehydration Management',icon: 'Droplets',description: 'Assessment and treatment of dehydration from gastroenteritis and other causes.' },
  { id: 'anaemia',         title: 'Anaemia Assessment & Treatment',icon: 'Activity',  description: 'Investigation and management of iron-deficiency and other forms of anaemia.' },
  { id: 'fever-mgmt',      title: 'Fever Management',             icon: 'Thermometer',description: 'Evaluation and treatment of fever with focus on identifying and treating the underlying cause.' },
  { id: 'growth-monitor',  title: 'Growth Monitoring',            icon: 'TrendingUp', description: 'Regular assessment of a child\'s height, weight, and development against standard milestones.' },
  { id: 'nutrition',       title: 'Nutritional Counseling',       icon: 'Leaf',       description: 'Guidance on age-appropriate nutrition and management of feeding difficulties.' },
  { id: 'routine-checkup', title: 'Routine Paediatric Checkups',  icon: 'Stethoscope',description: 'Scheduled health assessments to monitor development and detect issues early.' },
  { id: 'vaccination',     title: 'Vaccination Guidance',         icon: 'Shield',     description: 'Expert advice on the national immunisation schedule and catch-up vaccinations.' },
]

const SURGERY_SERVICES: Service[] = [
  { id: 'hernia-surgery',  title: 'Hernia Surgery',               icon: 'Scissors',   description: 'Repair of inguinal, umbilical, incisional, and other hernia types with minimal recovery.' },
  { id: 'gallstone',       title: 'Gallstone Treatment',          icon: 'Search',     description: 'Diagnosis and medical or surgical management of gallstone disease.' },
  { id: 'gallbladder',     title: 'Gallbladder Surgery',          icon: 'Scissors',   description: 'Laparoscopic and open cholecystectomy for symptomatic gallbladder conditions.' },
  { id: 'minor-procedures',title: 'Minor Surgical Procedures',    icon: 'Activity',   description: 'Day-case surgical procedures including cyst removal, wound closure, and excisions.' },
  { id: 'wound-mgmt',      title: 'Wound Management',             icon: 'Shield',     description: 'Expert care for acute and chronic wounds including debridement and dressing.' },
  { id: 'surgical-consult',title: 'Surgical Consultation',        icon: 'Stethoscope',description: 'Pre-operative evaluation and surgical planning for elective and emergency procedures.' },
  { id: 'preop-assess',    title: 'Pre-operative Assessment',     icon: 'ClipboardCheck', description: 'Comprehensive health assessment to prepare patients for safe surgery.' },
  { id: 'postop-followup', title: 'Post-operative Follow-up',     icon: 'RefreshCcw', description: 'Structured monitoring after surgery to ensure optimal recovery and detect complications.' },
]

const GYNECOLOGY_SERVICES: Service[] = [
  { id: 'gyn-consult',     title: 'Gynecology Consultation',      icon: 'Stethoscope',description: 'Comprehensive gynaecological assessment covering all aspects of women\'s reproductive health.' },
  { id: 'pregnancy-counsel',title: 'Pregnancy Counseling',        icon: 'Heart',      description: 'Pre-conception advice and early pregnancy guidance to support a healthy outcome.' },
  { id: 'antenatal',       title: 'Antenatal Care',               icon: 'Calendar',   description: 'Regular monitoring of mother and baby throughout pregnancy with evidence-based protocols.' },
  { id: 'menstrual',       title: 'Menstrual Disorder Management',icon: 'Activity',   description: 'Assessment and treatment of irregular periods, dysmenorrhea, and menstrual cycle disorders.' },
  { id: 'womens-screening',title: "Women's Health Screening",     icon: 'Shield',     description: 'Preventive health checks including cervical screening and breast health assessment.' },
  { id: 'family-planning', title: 'Family Planning Consultation', icon: 'Users',      description: 'Expert guidance on contraception methods, fertility awareness, and family planning goals.' },
  { id: 'postnatal',       title: 'Postnatal Follow-up',          icon: 'RefreshCcw', description: 'Post-delivery care monitoring both mother and newborn health in the postnatal period.' },
]

const DERMATOLOGY_SERVICES: Service[] = [
  { id: 'prp',             title: 'PRP Therapy',                  icon: 'Sparkles',   description: 'Platelet-rich plasma injections to stimulate collagen, treat hair loss, and rejuvenate skin.' },
  { id: 'microneedling',   title: 'Microneedling',                icon: 'Star',       description: 'Collagen-induction therapy for acne scars, fine lines, and uneven skin texture.' },
  { id: 'hydra-facial',    title: 'Hydra Facial',                 icon: 'Droplets',   description: 'Multi-step facial treatment combining deep cleansing, exfoliation, and intense hydration.' },
  { id: 'laser',           title: 'Laser Treatments',             icon: 'Zap',        description: 'Advanced laser therapy for pigmentation, vascular lesions, and skin resurfacing.' },
  { id: 'mole-removal',    title: 'Mole Removal',                 icon: 'Scissors',   description: 'Safe removal of benign moles and skin tags with minimal scarring using precise technique.' },
  { id: 'plasma-pen',      title: 'Plasma Pen Treatment',         icon: 'Wand2',      description: 'Non-surgical skin tightening and rejuvenation for wrinkles, saggy skin, and blemishes.' },
]

// ── Master map ────────────────────────────────────────────────

const SERVICES_MAP: Record<DepartmentId, Service[]> = {
  cardiology:   CARDIOLOGY_SERVICES,
  ent:          ENT_SERVICES,
  orthopedics:  ORTHOPEDICS_SERVICES,
  pediatrics:   PEDIATRICS_SERVICES,
  surgery:      SURGERY_SERVICES,
  gynecology:   GYNECOLOGY_SERVICES,
  dermatology:  DERMATOLOGY_SERVICES,
}

// ── Query helpers ──────────────────────────────────────────────

/** Returns all services for a given department id. */
export function getDepartmentServices(id: string): Service[] {
  return SERVICES_MAP[id as DepartmentId] ?? []
}

export { SERVICES_MAP }
