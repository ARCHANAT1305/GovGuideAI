import { Scheme, UserProfile, EligibilityEvaluation } from './types';
import { SCHEMES_DATABASE } from '@/data/schemes';

export function evaluateEligibility(profile: UserProfile, scheme: Scheme): EligibilityEvaluation {
  const criteriaMet: string[] = [];
  const criteriaMissing: string[] = [];
  let score = 50; // Base score

  // 1. Gender check
  if (scheme.genderEligibility && scheme.genderEligibility !== 'All') {
    if (profile.gender.toLowerCase() === scheme.genderEligibility.toLowerCase()) {
      criteriaMet.push(`Gender requirement matched (${scheme.genderEligibility})`);
      score += 15;
    } else {
      criteriaMissing.push(`Exclusively for ${scheme.genderEligibility} applicants`);
      score -= 50;
    }
  } else {
    criteriaMet.push('Open to all genders');
    score += 5;
  }

  // 2. Age check
  const age = Number(profile.age);
  if (!isNaN(age) && age > 0) {
    if (scheme.minAge !== undefined && age < scheme.minAge) {
      criteriaMissing.push(`Minimum age is ${scheme.minAge} years (You entered ${age})`);
      score -= 30;
    } else if (scheme.maxAge !== undefined && age > scheme.maxAge) {
      criteriaMissing.push(`Maximum age limit is ${scheme.maxAge} years (You entered ${age})`);
      score -= 30;
    } else {
      if (scheme.minAge !== undefined || scheme.maxAge !== undefined) {
        criteriaMet.push(`Age criteria satisfied (${scheme.minAge || 0} - ${scheme.maxAge || 'Any'} years)`);
        score += 15;
      }
    }
  }

  // 3. Income check
  const income = Number(profile.annualIncome);
  if (!isNaN(income) && scheme.maxIncomeLimit !== undefined) {
    if (income <= scheme.maxIncomeLimit) {
      criteriaMet.push(`Annual income ₹${income.toLocaleString()} is within the ceiling of ₹${scheme.maxIncomeLimit.toLocaleString()}`);
      score += 20;
    } else {
      criteriaMissing.push(`Annual income ₹${income.toLocaleString()} exceeds the maximum threshold of ₹${scheme.maxIncomeLimit.toLocaleString()}`);
      score -= 35;
    }
  } else if (scheme.maxIncomeLimit === undefined) {
    criteriaMet.push('No income ceiling restrictions');
    score += 5;
  }

  // 4. Target audience & occupation check
  const occ = profile.occupation.toLowerCase();
  const audienceMatches = scheme.targetAudience.some(aud => {
    const a = aud.toLowerCase();
    if (a === 'farmer' && (occ.includes('farm') || profile.isFarmer)) return true;
    if (a === 'student' && (occ.includes('stud') || profile.isStudent)) return true;
    if (a === 'entrepreneur' && (occ.includes('business') || occ.includes('self') || occ.includes('artisan') || occ.includes('craft'))) return true;
    if (a === 'senior citizen' && age >= 60) return true;
    if (a === 'women' && profile.gender.toLowerCase() === 'female') return true;
    if (a === 'low income family' && income <= 300000) return true;
    if (a === 'general') return true;
    return false;
  });

  if (audienceMatches) {
    criteriaMet.push(`Matches target group: ${scheme.targetAudience.join(', ')}`);
    score += 20;
  } else {
    // Check if the scheme is dedicated specifically to a profession
    if (scheme.targetAudience.includes('Farmer') && !occ.includes('farm') && !profile.isFarmer) {
      criteriaMissing.push('Intended primarily for registered agricultural landholders');
      score -= 25;
    } else if (scheme.targetAudience.includes('Student') && !occ.includes('stud') && !profile.isStudent) {
      criteriaMissing.push('Intended for currently enrolled students');
      score -= 25;
    }
  }

  // Clamp score
  const finalScore = Math.max(5, Math.min(100, Math.round(score)));
  const isEligible = criteriaMissing.length === 0 && finalScore >= 60;

  let recommendationLevel: 'High' | 'Medium' | 'Low' = 'Low';
  if (finalScore >= 80) recommendationLevel = 'High';
  else if (finalScore >= 55) recommendationLevel = 'Medium';

  return {
    scheme,
    isEligible,
    matchScore: finalScore,
    criteriaMet,
    criteriaMissing,
    recommendationLevel
  };
}

export function searchSchemes(query: string, category: string = 'All'): Scheme[] {
  let list = SCHEMES_DATABASE;

  if (category && category !== 'All') {
    list = list.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }

  if (!query || query.trim() === '') {
    return list;
  }

  const q = query.toLowerCase().trim();
  return list.filter(scheme => {
    return (
      scheme.name.toLowerCase().includes(q) ||
      scheme.shortName.toLowerCase().includes(q) ||
      scheme.description.toLowerCase().includes(q) ||
      scheme.ministry.toLowerCase().includes(q) ||
      scheme.tags.some(tag => tag.toLowerCase().includes(q)) ||
      scheme.targetAudience.some(aud => aud.toLowerCase().includes(q)) ||
      scheme.benefits.some(b => b.toLowerCase().includes(q))
    );
  });
}
