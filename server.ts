import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

// Synthetic Dataset (25 providers)
const PROVIDERS = [
  { id: 1, provider_name: "SafeGuard Mutual", location: "New York", policy_type: "Health", claim_approval_rate: 95, claim_rejection_rate: 5, complaints_last_year: 12, legal_cases: 1, regulatory_penalties: 0, customer_rating: 4.8, average_settlement_days: 14 },
  { id: 2, provider_name: "Urban Auto Shield", location: "Chicago", policy_type: "Car", claim_approval_rate: 70, claim_rejection_rate: 30, complaints_last_year: 85, legal_cases: 12, regulatory_penalties: 2, customer_rating: 2.1, average_settlement_days: 45 },
  { id: 3, provider_name: "Legacy Life Group", location: "Los Angeles", policy_type: "Life", claim_approval_rate: 98, claim_rejection_rate: 2, complaints_last_year: 5, legal_cases: 0, regulatory_penalties: 0, customer_rating: 4.9, average_settlement_days: 30 },
  { id: 4, provider_name: "Metro Health Plus", location: "New York", policy_type: "Health", claim_approval_rate: 82, claim_rejection_rate: 18, complaints_last_year: 45, legal_cases: 4, regulatory_penalties: 1, customer_rating: 3.5, average_settlement_days: 22 },
  { id: 5, provider_name: "QuickDrive Insurance", location: "Chicago", policy_type: "Car", claim_approval_rate: 88, claim_rejection_rate: 12, complaints_last_year: 20, legal_cases: 2, regulatory_penalties: 0, customer_rating: 4.2, average_settlement_days: 10 },
  { id: 6, provider_name: "Evergreen Life", location: "Seattle", policy_type: "Life", claim_approval_rate: 92, claim_rejection_rate: 8, complaints_last_year: 15, legal_cases: 1, regulatory_penalties: 0, customer_rating: 4.5, average_settlement_days: 25 },
  { id: 7, provider_name: "Empire State Auto", location: "New York", policy_type: "Car", claim_approval_rate: 65, claim_rejection_rate: 35, complaints_last_year: 110, legal_cases: 15, regulatory_penalties: 3, customer_rating: 1.8, average_settlement_days: 55 },
  { id: 8, provider_name: "Pacific Health", location: "Los Angeles", policy_type: "Health", claim_approval_rate: 90, claim_rejection_rate: 10, complaints_last_year: 18, legal_cases: 2, regulatory_penalties: 0, customer_rating: 4.3, average_settlement_days: 18 },
  { id: 9, provider_name: "Windy City Life", location: "Chicago", policy_type: "Life", claim_approval_rate: 94, claim_rejection_rate: 6, complaints_last_year: 10, legal_cases: 1, regulatory_penalties: 0, customer_rating: 4.7, average_settlement_days: 28 },
  { id: 10, provider_name: "Rainy Day Auto", location: "Seattle", policy_type: "Car", claim_approval_rate: 75, claim_rejection_rate: 25, complaints_last_year: 60, legal_cases: 8, regulatory_penalties: 1, customer_rating: 2.9, average_settlement_days: 40 },
  { id: 11, provider_name: "Liberty Health", location: "New York", policy_type: "Health", claim_approval_rate: 85, claim_rejection_rate: 15, complaints_last_year: 30, legal_cases: 3, regulatory_penalties: 0, customer_rating: 3.8, average_settlement_days: 20 },
  { id: 12, provider_name: "Golden State Auto", location: "Los Angeles", policy_type: "Car", claim_approval_rate: 80, claim_rejection_rate: 20, complaints_last_year: 40, legal_cases: 5, regulatory_penalties: 1, customer_rating: 3.2, average_settlement_days: 35 },
  { id: 13, provider_name: "Northwest Life", location: "Seattle", policy_type: "Life", claim_approval_rate: 96, claim_rejection_rate: 4, complaints_last_year: 8, legal_cases: 0, regulatory_penalties: 0, customer_rating: 4.8, average_settlement_days: 22 },
  { id: 14, provider_name: "Big Apple Life", location: "New York", policy_type: "Life", claim_approval_rate: 91, claim_rejection_rate: 9, complaints_last_year: 22, legal_cases: 2, regulatory_penalties: 0, customer_rating: 4.1, average_settlement_days: 32 },
  { id: 15, provider_name: "L.A. Speed Insurance", location: "Los Angeles", policy_type: "Car", claim_approval_rate: 72, claim_rejection_rate: 28, complaints_last_year: 75, legal_cases: 10, regulatory_penalties: 2, customer_rating: 2.5, average_settlement_days: 48 },
  { id: 16, provider_name: "Emerald City Health", location: "Seattle", policy_type: "Health", claim_approval_rate: 89, claim_rejection_rate: 11, complaints_last_year: 25, legal_cases: 2, regulatory_penalties: 0, customer_rating: 4.0, average_settlement_days: 15 },
  { id: 17, provider_name: "Midwest Mutual Health", location: "Chicago", policy_type: "Health", claim_approval_rate: 87, claim_rejection_rate: 13, complaints_last_year: 28, legal_cases: 3, regulatory_penalties: 0, customer_rating: 3.9, average_settlement_days: 19 },
  { id: 18, provider_name: "Coastal Auto", location: "Miami", policy_type: "Car", claim_approval_rate: 78, claim_rejection_rate: 22, complaints_last_year: 55, legal_cases: 7, regulatory_penalties: 1, customer_rating: 3.0, average_settlement_days: 38 },
  { id: 19, provider_name: "Sunshine Life", location: "Miami", policy_type: "Life", claim_approval_rate: 95, claim_rejection_rate: 5, complaints_last_year: 10, legal_cases: 1, regulatory_penalties: 0, customer_rating: 4.6, average_settlement_days: 24 },
  { id: 20, provider_name: "Everglades Health", location: "Miami", policy_type: "Health", claim_approval_rate: 84, claim_rejection_rate: 16, complaints_last_year: 35, legal_cases: 4, regulatory_penalties: 1, customer_rating: 3.6, average_settlement_days: 21 },
  { id: 21, provider_name: "Lone Star Auto", location: "Houston", policy_type: "Car", claim_approval_rate: 82, claim_rejection_rate: 18, complaints_last_year: 42, legal_cases: 5, regulatory_penalties: 0, customer_rating: 3.4, average_settlement_days: 33 },
  { id: 22, provider_name: "Houston Health", location: "Houston", policy_type: "Health", claim_approval_rate: 91, claim_rejection_rate: 9, complaints_last_year: 15, legal_cases: 1, regulatory_penalties: 0, customer_rating: 4.4, average_settlement_days: 16 },
  { id: 23, provider_name: "Space City Life", location: "Houston", policy_type: "Life", claim_approval_rate: 97, claim_rejection_rate: 3, complaints_last_year: 6, legal_cases: 0, regulatory_penalties: 0, customer_rating: 4.9, average_settlement_days: 20 },
  { id: 24, provider_name: "Bayou Auto", location: "Houston", policy_type: "Car", claim_approval_rate: 68, claim_rejection_rate: 32, complaints_last_year: 95, legal_cases: 14, regulatory_penalties: 2, customer_rating: 2.0, average_settlement_days: 52 },
  { id: 25, provider_name: "Gulf Coast Health", location: "Houston", policy_type: "Health", claim_approval_rate: 88, claim_rejection_rate: 12, complaints_last_year: 24, legal_cases: 2, regulatory_penalties: 0, customer_rating: 4.1, average_settlement_days: 17 },
];

/**
 * Calculates the Fraud Risk Score based on a weighted formula.
 * risk_score = (0.3 * rejection_rate) + (0.25 * complaint_score) + (0.2 * legal_cases_weight) + (0.15 * settlement_delay_score) - (0.1 * customer_rating_score)
 */
function calculateRisk(provider: any) {
  // Normalize components to 0-100 scale for internal calculation
  const rejection_rate = provider.claim_rejection_rate; // already 0-100
  const complaint_score = Math.min(provider.complaints_last_year, 100); // capped at 100
  const legal_cases_weight = Math.min(provider.legal_cases * 5, 100); // 20 cases = 100 score
  const settlement_delay_score = Math.min(provider.average_settlement_days * 1.5, 100); // 66 days = 100 score
  const customer_rating_score = provider.customer_rating * 20; // 5.0 = 100 score

  let rawScore = (0.3 * rejection_rate) + 
                 (0.25 * complaint_score) + 
                 (0.2 * legal_cases_weight) + 
                 (0.15 * settlement_delay_score) - 
                 (0.1 * customer_rating_score);

  // Normalize to 0-100 scale (shift and scale if needed, but here we just clamp)
  // Since the max possible raw score is roughly 90 and min is -10, we'll just clamp it
  const riskScore = Math.max(0, Math.min(100, Math.round(rawScore + 10))); // adding 10 to offset the negative rating potential

  let riskLevel = "Low Risk";
  if (riskScore > 60) riskLevel = "High Risk";
  else if (riskScore > 30) riskLevel = "Medium Risk";

  // Generate a short explanation
  let reasons = [];
  if (provider.claim_rejection_rate > 20) reasons.push("high rejection rate");
  if (provider.complaints_last_year > 50) reasons.push("many complaints");
  if (provider.legal_cases > 5) reasons.push("significant legal cases");
  if (provider.average_settlement_days > 40) reasons.push("settlement delays");
  if (provider.customer_rating < 3.0) reasons.push("poor customer ratings");

  const explanation = reasons.length > 0 
    ? `${reasons.join(" and ").charAt(0).toUpperCase() + reasons.join(" and ").slice(1)} increased the risk score.`
    : "Provider shows stable metrics and low anomaly indicators.";

  return { riskScore, riskLevel, explanation };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Get available filters
  app.get("/api/filters", (req, res) => {
    const locations = [...new Set(PROVIDERS.map(p => p.location))];
    const policyTypes = [...new Set(PROVIDERS.map(p => p.policy_type))];
    res.json({ locations, policyTypes });
  });

  // API Route: Get results based on filters
  app.get("/api/results", (req, res) => {
    const { location, policyType } = req.query;

    let filtered = PROVIDERS;
    if (location) filtered = filtered.filter(p => p.location === location);
    if (policyType) filtered = filtered.filter(p => p.policy_type === policyType);

    const results = filtered.map(p => {
      const riskData = calculateRisk(p);
      return { ...p, ...riskData };
    });

    // Sort by lowest risk first
    results.sort((a, b) => a.riskScore - b.riskScore);

    res.json(results);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
