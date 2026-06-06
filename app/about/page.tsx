import type { Metadata } from 'next'
import Image from 'next/image'
import { MapPin, Phone, Clock, Heart } from 'lucide-react'
import { HOSPITAL_NAME, HOSPITAL_TAGLINE } from '@/lib/hospital/data'
import { buildGeneralBookingUrl } from '@/lib/hospital/whatsapp'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: `About — ${HOSPITAL_NAME}`,
  description:
    `${HOSPITAL_NAME} is located at Tanda Chowk, Beside Sadar Police Station, ` +
    `Jalalpur Jattan, District Gujrat, Punjab, Pakistan. ` +
    `Providing specialist and trauma care with 8 departments and 24/7 emergency services.`,
}

export default function AboutPage() {
  const whatsappUrl = buildGeneralBookingUrl()

  return (
    <main className={styles.page}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <span className={styles.label}>About us</span>
        <h1 className={styles.title}>{HOSPITAL_NAME}</h1>
        <p className={styles.tagline}>{HOSPITAL_TAGLINE}</p>
      </section>

      {/* ── Hospital photo ───────────────────────────────────── */}
      <div className={styles.photoWrap}>
        <div className={styles.photoCard}>
          <Image
            src="/hospital/building.jpg"
            alt={`${HOSPITAL_NAME} building`}
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className={styles.photo}
            quality={90}
            priority
          />
          <div className={styles.photoGradient} aria-hidden="true" />
        </div>
      </div>

      {/* ── Info cards ───────────────────────────────────────── */}
      <div className={styles.infoGrid}>

        {/* Address */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Location</span>
          <div className={styles.cardIcon}>
            <span className={styles.iconWrap}>
              <MapPin size={18} strokeWidth={1.8} />
            </span>
            <p className={styles.cardText}>
              <strong>Tanda Chowk</strong><br />
              Beside Sadar Police Station<br />
              Jalalpur Jattan<br />
              District Gujrat, Punjab<br />
              Pakistan
            </p>
          </div>
        </div>

        {/* Book / WhatsApp */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Appointments</span>
          <div className={styles.cardIcon}>
            <span className={styles.iconWrap}>
              <Phone size={18} strokeWidth={1.8} />
            </span>
            <div>
              <p className={styles.cardText} style={{ marginBottom: '0.75rem' }}>
                Book your appointment instantly via WhatsApp.
                Our team responds promptly to confirm your slot.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.waLink}
              >
                <WhatsAppIcon />
                Book on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Emergency */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Emergency & Hours</span>
          <div className={styles.cardIcon}>
            <span className={styles.iconWrap}>
              <Clock size={18} strokeWidth={1.8} />
            </span>
            <p className={styles.cardText}>
              <strong>Emergency Trauma Care</strong><br />
              Available 24 hours · 7 days a week<br /><br />
              <strong>OPD Clinics</strong><br />
              Mon – Sat · Department-specific timings
            </p>
          </div>
        </div>

        {/* Specialties */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Specialties</span>
          <div className={styles.cardIcon}>
            <span className={styles.iconWrap}>
              <Heart size={18} strokeWidth={1.8} />
            </span>
            <p className={styles.cardText}>
              Pediatrics · General Surgery · ENT<br />
              Orthopedics · Gynecology<br />
              Dermatology · Cardiology<br /><br />
              <strong>8 departments · 10+ specialists</strong>
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}

function WhatsAppIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
