import { useState } from "react";
import "./SmartTips.css";

function SmartTips({ income, expense, savingsRate }) {
  const quotes = [
  "Track your money before your money ghosts you.",
  "Saving money is also a flex.",
  "Spend smart today, chill harder tomorrow.",
  "Your wallet deserves better treatment.",
  "Budget banana boring hai, broke hona usse bhi boring.",
  "Money saved is money that did not leave you on seen.",
  "Control expenses before expenses control your mood.",
  "Small savings today, big peace later.",
  "Don’t let your bank balance become a horror story.",
  "Spend like a legend, but save like a boss.",
  "Your future self will either thank you or roast you.",
  "UPI fast hai, but regret usse bhi fast aata hai.",
  "Aaj ka impulse buy, kal ka ‘kyu liya bhai?’",
  "PaisaPilot says: chill karo, but budget ke andar.",
  "Being broke is not a personality trait."
];

  const [quote] = useState(function () {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  });

  function getTips() {
    const tips = [];

    if (income === 0) {
      tips.push({
        emoji: "💰",
        title: "Add Income",
        text: "No income found. App bhi confuse hai ki paisa aa kahan se raha hai.",
      });
    }

    if (expense === 0) {
      tips.push({
        emoji: "🧾",
        title: "Start Tracking",
        text: "No expenses added yet. Either you are saving like a pro or forgot to track.",
      });
    }

    if (income > 0 && savingsRate >= 30) {
      tips.push({
        emoji: "🔥",
        title: "Good Savings",
        text: "Nice! Your savings are looking healthy. Wallet is proud of you.",
      });
    }

    if (income > 0 && savingsRate < 20) {
      tips.push({
        emoji: "⚠️",
        title: "Low Savings",
        text: "Your savings rate is low. Time to ask: need hai ya bas mood hai?",
      });
    }

    if (expense > income && income > 0) {
      tips.push({
        emoji: "🚨",
        title: "Overspending",
        text: "Overspending detected. Your money is leaving faster than weekend plans.",
      });
    }

    if (income > 0 && expense < income) {
      tips.push({
        emoji: "✅",
        title: "Under Control",
        text: "Your expenses are under control. Keep this money habit going.",
      });
    }

    if (tips.length === 0) {
      tips.push({
        emoji: "✨",
        title: "Keep Going",
        text: "Keep adding income and expenses to get better money tips.",
      });
    }

    return tips.slice(0, 3);
  }

  const tips = getTips();

  return (
    <div className="smart-tips-card">
      <div className="smart-tips-top">
        <div>
          <p className="smart-label">Smart Assistant</p>
          <h2>Money Tips</h2>
        </div>
        <div className="smart-icon">💡</div>
      </div>

      <div className="smart-tips-grid">
        {tips.map(function (tip, index) {
          return (
            <div className="smart-tip-box" key={index}>
              <div className="tip-emoji">{tip.emoji}</div>
              <div>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="smart-quote">
        <span>💭</span>
        <p>{quote}</p>
      </div>
    </div>
  );
}

export default SmartTips;