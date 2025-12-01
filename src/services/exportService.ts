import html2pdf from 'html2pdf.js';

interface ExportData {
  profile: any;
  tasks: any[];
  moods: any[];
  journal: any[];
  chat: any[];
  noContactMessages?: any[];
  communityPosts?: any[];
}

export const generatePDF = async (data: ExportData) => {
  const { profile, tasks, moods, journal, noContactMessages } = data;
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate stats
  const completedTasks = tasks.filter((t: any) => t.completed).length;
  const totalTasks = tasks.length;
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const moodCount = moods.length;
  const averageMood = moodCount > 0
    ? Math.round(moods.reduce((acc: number, m: any) => acc + m.intensity, 0) / moodCount)
    : 0;

  const content = `
    <div style="font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px;">
        <h1 style="color: #4B0082; margin: 0; font-size: 28px;">LoveDetox Recovery Report</h1>
        <p style="color: #666; margin: 10px 0 0;">Generated on ${date}</p>
      </div>

      <!-- User Profile -->
      <div style="background: #fdfdfd; border-radius: 12px; padding: 20px; margin-bottom: 30px; border: 1px solid #eee;">
        <h2 style="color: #4B0082; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Profile Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p><strong>Name:</strong> ${profile.name}</p>
            <p><strong>Email:</strong> ${profile.email}</p>
            <p><strong>Phase:</strong> ${profile.phase}</p>
          </div>
          <div>
            <p><strong>No Contact Streak:</strong> ${profile.noContactDays} days</p>
            <p><strong>Recovery Progress:</strong> ${profile.recoveryProgress}%</p>
            <p><strong>Account Type:</strong> ${profile.isPro ? 'Pro Member' : 'Free Member'}</p>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div style="display: flex; gap: 20px; margin-bottom: 30px;">
        <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
          <h3 style="margin: 0; color: #666; font-size: 14px;">Journal Entries</h3>
          <p style="margin: 5px 0 0; font-size: 24px; color: #4B0082; font-weight: bold;">${journal.length}</p>
        </div>
        <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
          <h3 style="margin: 0; color: #666; font-size: 14px;">Avg Mood</h3>
          <p style="margin: 5px 0 0; font-size: 24px; color: #FF8DAA; font-weight: bold;">${averageMood}/10</p>
        </div>
        <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
          <h3 style="margin: 0; color: #666; font-size: 14px;">Tasks Completed</h3>
          <p style="margin: 5px 0 0; font-size: 24px; color: #4B0082; font-weight: bold;">${taskRate}%</p>
        </div>
      </div>

      <!-- Journal Entries -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #4B0082; border-bottom: 1px solid #eee; padding-bottom: 10px;">Recent Journal Entries</h2>
        ${journal.length > 0 ? journal.slice(0, 5).map((entry: any) => `
          <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #f5f5f5;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <strong style="color: #333;">${new Date(entry.createdAt).toLocaleDateString()}</strong>
              <span style="background: #f0f0f0; padding: 2px 8px; border-radius: 10px; font-size: 12px;">${entry.mood || 'Reflection'}</span>
            </div>
            <p style="margin: 0; color: #555; font-style: italic;">"${entry.content}"</p>
          </div>
        `).join('') : '<p style="color: #999;">No journal entries yet.</p>'}
      </div>

      <!-- Mood History -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #4B0082; border-bottom: 1px solid #eee; padding-bottom: 10px;">Recent Moods</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          ${moods.length > 0 ? moods.slice(0, 10).map((mood: any) => `
            <div style="background: ${getMoodColor(mood.intensity)}; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px;">
              ${mood.emotion} (${mood.intensity})
            </div>
          `).join('') : '<p style="color: #999;">No mood data recorded.</p>'}
        </div>
      </div>

      <!-- No Contact Messages -->
      ${noContactMessages && noContactMessages.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #4B0082; border-bottom: 1px solid #eee; padding-bottom: 10px;">Saved Unsent Messages</h2>
          ${noContactMessages.map((msg: any) => `
            <div style="background: #fff0f5; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #FF8DAA;">
              <p style="margin: 0 0 5px; font-size: 12px; color: #999;">${new Date(msg.createdAt).toLocaleDateString()}</p>
              <p style="margin: 0; color: #444;">${msg.message}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="margin-top: 50px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
        <p>LoveDetox - Your Journey to Healing</p>
        <p>This report is private and confidential.</p>
      </div>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = content;

  const opt = {
    margin: 10,
    filename: `LoveDetox_Report_${profile.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Workaround: html2canvas fails with Tailwind v4's oklch colors.
  // We temporarily remove stylesheets since we use inline styles for the PDF.
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
  styles.forEach(style => style.remove());

  try {
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('PDF Generation failed:', error);
    throw error;
  } finally {
    // Restore styles
    styles.forEach(style => document.head.appendChild(style));
  }
};

function getMoodColor(intensity: number): string {
  if (intensity >= 8) return '#ef4444'; // Red for high intensity
  if (intensity >= 5) return '#f59e0b'; // Orange/Yellow for medium
  return '#10b981'; // Green for low/calm
}

export default { generatePDF };
