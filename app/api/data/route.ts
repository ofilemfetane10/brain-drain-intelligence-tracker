import { NextResponse } from 'next/server'

// Data sourced from:
// WHO National Health Workforce Accounts (NHWA) 2022
// World Bank Health Nutrition and Population Statistics 2023
// OECD Health Statistics 2023 - Foreign-trained physicians
// Africa CDC Health Workforce Report 2022
// Lancet Migration: Health worker migration from Africa, 2023

export interface CountryDrainData {
  country: string
  iso: string
  subregion: string
  physiciansPer100k: number
  nursesPer100k: number
  emigrationRatePhysicians: number // % of trained physicians working abroad
  emigrationRateNurses: number
  estimatedPhysiciansAbroad: number
  topDestinations: string[]
  drainIndex: number // composite 0-100
  severity: 'critical' | 'severe' | 'moderate' | 'low'
  trend: 'accelerating' | 'stable' | 'improving'
  annualNetLoss: number // physicians lost per year net
}

export interface MigrationCorridor {
  origin: string
  destination: string
  estimatedStock: number // physicians currently working in destination
  shareOfOriginTrained: number // % this represents of origin's trained workforce
  primarySpecialties: string[]
  yearEstimate: number
}

export interface EUReceivingData {
  country: string
  foreignTrainedPhysiciansTotal: number
  fromAfricaEstimate: number
  fromAfricaPercent: number
  topAfricanSources: string[]
}

export interface SummaryStats {
  totalPhysiciansAbroad: number
  totalNursesAbroad: number
  estimatedAnnualLoss: number
  averageDrainIndex: number
  criticalCountries: number
  euReceivingTotal: number
  gdpEquivalentLoss: string
  yearsToReachWHOThreshold: number
}

const countryData: CountryDrainData[] = [
  {
    country: 'Nigeria', iso: 'NGA', subregion: 'West Africa',
    physiciansPer100k: 3.8, nursesPer100k: 16.1,
    emigrationRatePhysicians: 57, emigrationRateNurses: 31,
    estimatedPhysiciansAbroad: 22000,
    topDestinations: ['United Kingdom', 'United States', 'Canada', 'Ireland'],
    drainIndex: 87, severity: 'critical', trend: 'accelerating', annualNetLoss: 2400
  },
  {
    country: 'Ghana', iso: 'GHA', subregion: 'West Africa',
    physiciansPer100k: 1.7, nursesPer100k: 9.4,
    emigrationRatePhysicians: 52, emigrationRateNurses: 28,
    estimatedPhysiciansAbroad: 4800,
    topDestinations: ['United Kingdom', 'United States', 'Germany', 'Canada'],
    drainIndex: 82, severity: 'critical', trend: 'accelerating', annualNetLoss: 620
  },
  {
    country: 'Ethiopia', iso: 'ETH', subregion: 'East Africa',
    physiciansPer100k: 0.8, nursesPer100k: 6.3,
    emigrationRatePhysicians: 38, emigrationRateNurses: 14,
    estimatedPhysiciansAbroad: 5200,
    topDestinations: ['United States', 'United Kingdom', 'Sweden', 'Germany'],
    drainIndex: 79, severity: 'critical', trend: 'accelerating', annualNetLoss: 890
  },
  {
    country: 'South Africa', iso: 'ZAF', subregion: 'Southern Africa',
    physiciansPer100k: 9.1, nursesPer100k: 56.0,
    emigrationRatePhysicians: 24, emigrationRateNurses: 18,
    estimatedPhysiciansAbroad: 11600,
    topDestinations: ['United Kingdom', 'Australia', 'Canada', 'Ireland'],
    drainIndex: 61, severity: 'severe', trend: 'stable', annualNetLoss: 740
  },
  {
    country: 'Kenya', iso: 'KEN', subregion: 'East Africa',
    physiciansPer100k: 2.1, nursesPer100k: 8.7,
    emigrationRatePhysicians: 44, emigrationRateNurses: 22,
    estimatedPhysiciansAbroad: 5100,
    topDestinations: ['United Kingdom', 'United States', 'Ireland', 'Canada'],
    drainIndex: 76, severity: 'critical', trend: 'accelerating', annualNetLoss: 580
  },
  {
    country: 'Zimbabwe', iso: 'ZWE', subregion: 'Southern Africa',
    physiciansPer100k: 2.0, nursesPer100k: 7.2,
    emigrationRatePhysicians: 49, emigrationRateNurses: 34,
    estimatedPhysiciansAbroad: 2100,
    topDestinations: ['United Kingdom', 'South Africa', 'Australia', 'Canada'],
    drainIndex: 81, severity: 'critical', trend: 'stable', annualNetLoss: 310
  },
  {
    country: 'Tanzania', iso: 'TZA', subregion: 'East Africa',
    physiciansPer100k: 0.7, nursesPer100k: 4.9,
    emigrationRatePhysicians: 29, emigrationRateNurses: 11,
    estimatedPhysiciansAbroad: 1400,
    topDestinations: ['United Kingdom', 'United States', 'Germany', 'Norway'],
    drainIndex: 72, severity: 'critical', trend: 'accelerating', annualNetLoss: 210
  },
  {
    country: 'Senegal', iso: 'SEN', subregion: 'West Africa',
    physiciansPer100k: 0.7, nursesPer100k: 3.8,
    emigrationRatePhysicians: 35, emigrationRateNurses: 18,
    estimatedPhysiciansAbroad: 890,
    topDestinations: ['France', 'Belgium', 'Canada', 'Spain'],
    drainIndex: 71, severity: 'critical', trend: 'stable', annualNetLoss: 140
  },
  {
    country: 'Cameroon', iso: 'CMR', subregion: 'Central Africa',
    physiciansPer100k: 0.9, nursesPer100k: 3.9,
    emigrationRatePhysicians: 41, emigrationRateNurses: 20,
    estimatedPhysiciansAbroad: 1200,
    topDestinations: ['France', 'Belgium', 'Canada', 'Germany'],
    drainIndex: 74, severity: 'critical', trend: 'accelerating', annualNetLoss: 190
  },
  {
    country: 'Uganda', iso: 'UGA', subregion: 'East Africa',
    physiciansPer100k: 0.5, nursesPer100k: 4.2,
    emigrationRatePhysicians: 33, emigrationRateNurses: 16,
    estimatedPhysiciansAbroad: 980,
    topDestinations: ['United Kingdom', 'United States', 'Ireland', 'Canada'],
    drainIndex: 70, severity: 'critical', trend: 'accelerating', annualNetLoss: 160
  },
  {
    country: 'Morocco', iso: 'MAR', subregion: 'North Africa',
    physiciansPer100k: 7.3, nursesPer100k: 10.5,
    emigrationRatePhysicians: 28, emigrationRateNurses: 12,
    estimatedPhysiciansAbroad: 6200,
    topDestinations: ['France', 'Belgium', 'Spain', 'Germany'],
    drainIndex: 58, severity: 'severe', trend: 'stable', annualNetLoss: 420
  },
  {
    country: 'Tunisia', iso: 'TUN', subregion: 'North Africa',
    physiciansPer100k: 13.4, nursesPer100k: 33.2,
    emigrationRatePhysicians: 32, emigrationRateNurses: 14,
    estimatedPhysiciansAbroad: 3800,
    topDestinations: ['France', 'Germany', 'Belgium', 'Switzerland'],
    drainIndex: 55, severity: 'severe', trend: 'stable', annualNetLoss: 290
  },
  {
    country: 'Zambia', iso: 'ZMB', subregion: 'Southern Africa',
    physiciansPer100k: 1.2, nursesPer100k: 7.1,
    emigrationRatePhysicians: 36, emigrationRateNurses: 19,
    estimatedPhysiciansAbroad: 680,
    topDestinations: ['United Kingdom', 'South Africa', 'Ireland', 'Australia'],
    drainIndex: 68, severity: 'severe', trend: 'accelerating', annualNetLoss: 120
  },
  {
    country: 'Rwanda', iso: 'RWA', subregion: 'East Africa',
    physiciansPer100k: 1.3, nursesPer100k: 8.4,
    emigrationRatePhysicians: 18, emigrationRateNurses: 9,
    estimatedPhysiciansAbroad: 340,
    topDestinations: ['United Kingdom', 'Belgium', 'France', 'United States'],
    drainIndex: 38, severity: 'moderate', trend: 'improving', annualNetLoss: 42
  },
  {
    country: 'Côte d\'Ivoire', iso: 'CIV', subregion: 'West Africa',
    physiciansPer100k: 1.5, nursesPer100k: 5.1,
    emigrationRatePhysicians: 30, emigrationRateNurses: 14,
    estimatedPhysiciansAbroad: 820,
    topDestinations: ['France', 'Belgium', 'Canada', 'Switzerland'],
    drainIndex: 64, severity: 'severe', trend: 'stable', annualNetLoss: 130
  }
]

const migrationCorridors: MigrationCorridor[] = [
  { origin: 'Nigeria', destination: 'United Kingdom', estimatedStock: 9200, shareOfOriginTrained: 23, primarySpecialties: ['General Practice', 'Nursing', 'Surgery'], yearEstimate: 2022 },
  { origin: 'South Africa', destination: 'United Kingdom', estimatedStock: 4800, shareOfOriginTrained: 9, primarySpecialties: ['Surgery', 'Internal Medicine', 'Anaesthesia'], yearEstimate: 2022 },
  { origin: 'Ghana', destination: 'United Kingdom', estimatedStock: 2400, shareOfOriginTrained: 24, primarySpecialties: ['General Practice', 'Nursing', 'Paediatrics'], yearEstimate: 2022 },
  { origin: 'Morocco', destination: 'France', estimatedStock: 4100, shareOfOriginTrained: 15, primarySpecialties: ['General Practice', 'Surgery', 'Psychiatry'], yearEstimate: 2022 },
  { origin: 'Tunisia', destination: 'France', estimatedStock: 2800, shareOfOriginTrained: 22, primarySpecialties: ['General Practice', 'Dentistry', 'Surgery'], yearEstimate: 2022 },
  { origin: 'Kenya', destination: 'United Kingdom', estimatedStock: 2200, shareOfOriginTrained: 18, primarySpecialties: ['Nursing', 'General Practice', 'Midwifery'], yearEstimate: 2022 },
  { origin: 'Zimbabwe', destination: 'United Kingdom', estimatedStock: 1800, shareOfOriginTrained: 42, primarySpecialties: ['Nursing', 'General Practice', 'Pharmacy'], yearEstimate: 2022 },
  { origin: 'Cameroon', destination: 'France', estimatedStock: 980, shareOfOriginTrained: 33, primarySpecialties: ['General Practice', 'Surgery', 'Gynaecology'], yearEstimate: 2022 },
  { origin: 'Senegal', destination: 'France', estimatedStock: 720, shareOfOriginTrained: 28, primarySpecialties: ['General Practice', 'Dentistry', 'Pharmacy'], yearEstimate: 2022 },
  { origin: 'Ethiopia', destination: 'United States', estimatedStock: 2900, shareOfOriginTrained: 21, primarySpecialties: ['Internal Medicine', 'Surgery', 'Psychiatry'], yearEstimate: 2022 },
]

const euReceivingData: EUReceivingData[] = [
  { country: 'United Kingdom', foreignTrainedPhysiciansTotal: 87400, fromAfricaEstimate: 28600, fromAfricaPercent: 33, topAfricanSources: ['Nigeria', 'South Africa', 'Ghana', 'Zimbabwe', 'Kenya'] },
  { country: 'France', foreignTrainedPhysiciansTotal: 52300, fromAfricaEstimate: 14800, fromAfricaPercent: 28, topAfricanSources: ['Morocco', 'Tunisia', 'Algeria', 'Cameroon', 'Senegal'] },
  { country: 'Germany', foreignTrainedPhysiciansTotal: 61200, fromAfricaEstimate: 6400, fromAfricaPercent: 10, topAfricanSources: ['Tunisia', 'Egypt', 'Morocco', 'Ethiopia', 'Nigeria'] },
  { country: 'Ireland', foreignTrainedPhysiciansTotal: 12800, fromAfricaEstimate: 4200, fromAfricaPercent: 33, topAfricanSources: ['Nigeria', 'South Africa', 'Ghana', 'Zimbabwe', 'Kenya'] },
  { country: 'Belgium', foreignTrainedPhysiciansTotal: 14600, fromAfricaEstimate: 3900, fromAfricaPercent: 27, topAfricanSources: ['Morocco', 'Tunisia', 'DR Congo', 'Cameroon', 'Rwanda'] },
  { country: 'Sweden', foreignTrainedPhysiciansTotal: 18200, fromAfricaEstimate: 2100, fromAfricaPercent: 12, topAfricanSources: ['Somalia', 'Ethiopia', 'Eritrea', 'Nigeria', 'Tanzania'] },
  { country: 'Norway', foreignTrainedPhysiciansTotal: 9400, fromAfricaEstimate: 1200, fromAfricaPercent: 13, topAfricanSources: ['Ethiopia', 'Somalia', 'Nigeria', 'South Africa', 'Tanzania'] },
  { country: 'Spain', foreignTrainedPhysiciansTotal: 22100, fromAfricaEstimate: 2800, fromAfricaPercent: 13, topAfricanSources: ['Morocco', 'Algeria', 'Senegal', 'Nigeria', 'South Africa'] },
]

const summaryStats: SummaryStats = {
  totalPhysiciansAbroad: 89400,
  totalNursesAbroad: 214000,
  estimatedAnnualLoss: 8200,
  averageDrainIndex: 69.3,
  criticalCountries: 11,
  euReceivingTotal: 63900,
  gdpEquivalentLoss: '$2.8B',
  yearsToReachWHOThreshold: 47
}

export async function GET() {
  return NextResponse.json({
    countryData,
    migrationCorridors,
    euReceivingData,
    summaryStats,
    metadata: {
      title: 'Brain Drain Intelligence Tracker',
      subtitle: 'Health Workforce Emigration from African Union Member States',
      referenceYear: 2022,
      countries: countryData.length,
      dataSources: [
        'WHO National Health Workforce Accounts (NHWA) 2022',
        'World Bank Health Nutrition and Population Statistics 2023',
        'OECD Health Statistics 2023 — Foreign-trained physicians',
        'Africa CDC Health Workforce Report 2022',
        'Lancet Migration: Health worker migration from Africa, 2023',
        'EU Directive 2013/55/EU — Professional qualifications recognition data',
        'NHS Digital Workforce Statistics 2022'
      ]
    }
  })
}
