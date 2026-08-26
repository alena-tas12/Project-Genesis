import React, { useState } from 'react';
import { MoSPICompetencyFramework, type MoSPIOfficialProfile, type AdvancedGeneratedMCQ } from '../../engine/sih/mospiCompetencyFramework';
import { Award, Brain, CheckCircle, Database, FileText, Globe, Layers, RefreshCw, Server, Sparkles, Upload, Users, Zap } from 'lucide-react';

export const SIHMasterDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'heatmap' | 'profile' | 'nlp_quiz' | 'igot_api'>('heatmap');
  
  // Data State with Persistence
  const cadres = MoSPICompetencyFramework.getCadresList();
  const [officials, setOfficials] = useState<MoSPIOfficialProfile[]>(() => MoSPICompetencyFramework.getSampleMoSPIOfficials());
  const courses = MoSPICompetencyFramework.getIGOTCourseCatalog();

  const [selectedOfficial, setSelectedOfficial] = useState<MoSPIOfficialProfile>(officials[0]);
  const [selectedCadreFilter, setSelectedCadreFilter] = useState<string>('ALL');

  // NLP Quiz Generator State
  const [inputText, setInputText] = useState<string>(
    'MoSPI DIID Capacity Building Guidelines 2026:\nField officers in FOD and SDRD are required to adopt Computer-Assisted Personal Interviewing (CAPI) handheld tablets equipped with automated isolation forest algorithms to detect timestamp anomalies, non-response bias in urban strata, and GVA calculation errors.'
  );
  const [generatedQuizzes, setGeneratedQuizzes] = useState<AdvancedGeneratedMCQ[]>(() =>
    MoSPICompetencyFramework.parseDocumentAndGenerateNLPQuizzes(inputText, 4)
  );
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);
  const [apiSyncSuccess, setApiSyncSuccess] = useState<boolean>(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const handleGenerateNLPQuizzes = () => {
    const newQuizzes = MoSPICompetencyFramework.parseDocumentAndGenerateNLPQuizzes(inputText, 4);
    setGeneratedQuizzes(newQuizzes);
    setSelectedAnswers({});
    setShowQuizResults(false);
    setFeedbackNotice(null);
  };

  const handleSelectOption = (quizId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
  };

  const handleVerifyAnswersAndLoopSkillGap = () => {
    setShowQuizResults(true);

    // Calculate score percentage
    let correctCount = 0;
    generatedQuizzes.forEach(q => {
      const selectedIdx = selectedAnswers[q.id];
      if (selectedIdx !== undefined && q.options[selectedIdx]?.isCorrect) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / generatedQuizzes.length) * 100);

    // Closed-Loop: Update officer's competency profile dynamically!
    const domainCategory = generatedQuizzes[0]?.domainCategory || 'Survey Methodology';
    const updatedProfiles = MoSPICompetencyFramework.updateOfficialCompetencyAfterAssessment(
      selectedOfficial.id,
      domainCategory,
      scorePct
    );

    setOfficials(updatedProfiles);
    const refreshedSelected = updatedProfiles.find(o => o.id === selectedOfficial.id);
    if (refreshedSelected) {
      setSelectedOfficial(refreshedSelected);
    }

    setFeedbackNotice(
      `Assessment complete! Score: ${scorePct}%. Competency score for ${selectedOfficial.name} boosted by +${Math.round((scorePct / 100) * 12)}% and saved!`
    );
  };

  const handleToggleQuizApproval = (quizId: string) => {
    setGeneratedQuizzes(prev =>
      prev.map(q => {
        if (q.id === quizId) {
          const nextStatus = q.status === 'Approved' ? 'Pending Review' : 'Approved';
          return { ...q, status: nextStatus };
        }
        return q;
      })
    );
  };

  const handleTriggerIGOTSync = () => {
    setApiSyncSuccess(true);
    setTimeout(() => setApiSyncSuccess(false), 3000);
  };

  const filteredOfficials = selectedCadreFilter === 'ALL' 
    ? officials 
    : officials.filter(o => o.cadre === selectedCadreFilter);

  return (
    <div className="sih-master-container fade-in">
      {/* Enterprise Header Banner */}
      <div className="sih-master-banner">
        <div className="sih-header-top">
          <div className="sih-logo-group">
            <div className="sih-emblem-glow" />
            <div>
              <div className="sih-tagline">SMART INDIA HACKATHON — PROBLEM STATEMENT ID: 26101</div>
              <h2>MoSPI iGOT Karmayogi Capacity Building & AI Quiz Generator Master Suite</h2>
              <p className="sih-subtext">
                Ministry of Statistics and Programme Implementation (Data Informatics & Innovation Division - DIID)
              </p>
            </div>
          </div>

          <div className="sih-actions-group">
            <button onClick={handleTriggerIGOTSync} className="btn-sih-sync">
              <Server size={15} />
              <span>{apiSyncSuccess ? 'iGOT Telemetry Synced!' : 'Sync iGOT API Ecosystem'}</span>
            </button>
          </div>
        </div>

        {/* SIH Master Navigation Subtabs */}
        <div className="sih-nav-tabs">
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`sih-nav-btn ${activeTab === 'heatmap' ? 'active' : ''}`}
          >
            <Database size={15} />
            <span>Ministry Competency Heatmap</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`sih-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <Users size={15} />
            <span>Official Skill-Gap & iGOT Pathways</span>
          </button>

          <button
            onClick={() => setActiveTab('nlp_quiz')}
            className={`sih-nav-btn ${activeTab === 'nlp_quiz' ? 'active' : ''}`}
          >
            <Brain size={15} />
            <span>AI Document NLP MCQ Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('igot_api')}
            className={`sih-nav-btn ${activeTab === 'igot_api' ? 'active' : ''}`}
          >
            <Globe size={15} />
            <span>iGOT Ecosystem API Telemetry</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: MINISTRY COMPETENCY HEATMAP & CADRE ANALYTICS --- */}
      {activeTab === 'heatmap' && (
        <div className="sih-panel-view fade-in">
          <div className="sih-section-header">
            <h3>MoSPI Cadres & Division-Wide Competency Shortage Heatmap</h3>
            <p>Real-time analytics mapping capacity gaps across ISS, SSS, FOD, SDRD, DPD, and DIID cadres.</p>
          </div>

          {/* Cadre Cards Grid */}
          <div className="sih-cadres-grid">
            {cadres.map(c => (
              <div key={c.cadre} className="sih-cadre-card">
                <div className="cadre-top">
                  <span className="cadre-badge">{c.cadre}</span>
                  <span className="cadre-name">{c.name}</span>
                </div>
                <p className="cadre-desc">{c.description}</p>

                <div className="cadre-metrics-row">
                  <div className="metric-box">
                    <span className="m-lbl">Active Officials</span>
                    <span className="m-val">1,240</span>
                  </div>
                  <div className="metric-box">
                    <span className="m-lbl">AI/GIS Gap</span>
                    <span className="m-val-red">38% Shortage</span>
                  </div>
                  <div className="metric-box">
                    <span className="m-lbl">iGOT Completion</span>
                    <span className="m-val-cyan">87%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ministry Critical Skill Gaps Alert Box */}
          <div className="sih-alert-banner">
            <Sparkles className="icon-cyan" size={20} />
            <div>
              <h4>Critical Capacity Building Priority Identified (DIID AI Audit 2026)</h4>
              <p>
                82% of SSS Officers in Field Operations Division (FOD) require immediate upskilling in <strong>Automated Outlier Detection & CAPI Mobile Validation</strong>. 
                Recommended deployable pathway: <em>iGOT Course #igot-mospi-403</em>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: OFFICIAL SKILL-GAP & IGOT PATHWAY RECOMMENDER --- */}
      {activeTab === 'profile' && (
        <div className="sih-panel-view fade-in">
          <div className="sih-profile-layout">
            {/* Left: Officials List */}
            <div className="officials-selector-panel">
              <h4>MoSPI Personnel Directory</h4>
              <div className="cadre-filter-chips">
                {['ALL', 'ISS', 'SSS', 'DIID'].map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedCadreFilter(f)}
                    className={`filter-chip ${selectedCadreFilter === f ? 'active' : ''}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="officials-list">
                {filteredOfficials.map(off => (
                  <div
                    key={off.id}
                    onClick={() => setSelectedOfficial(off)}
                    className={`official-list-card ${selectedOfficial.id === off.id ? 'active' : ''}`}
                  >
                    <div className="off-name">{off.name}</div>
                    <div className="off-sub">{off.designation} • {off.postedDivision}</div>
                    <div className="off-readiness">
                      <span>Readiness Index:</span>
                      <span className="val-cyan">{off.overallReadinessIndexPct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Selected Official Competency Radar & Pathways */}
            <div className="official-detail-panel flex-1">
              <div className="detail-header-card">
                <div>
                  <h3>{selectedOfficial.name}</h3>
                  <span className="sub-tag">{selectedOfficial.designation} ({selectedOfficial.cadre} Cadre) — {selectedOfficial.postedDivision}</span>
                </div>
                <div className="readiness-gauge-box">
                  <span className="gauge-lbl">Ministry Readiness Index</span>
                  <span className="gauge-val">{selectedOfficial.overallReadinessIndexPct}%</span>
                </div>
              </div>

              {/* Competencies Gap Bars */}
              <div className="competencies-radar-box">
                <h4>Individual Competency Gap Assessment</h4>
                <div className="comp-bars-list">
                  {selectedOfficial.competencies.map(comp => (
                    <div key={comp.id} className="comp-bar-item">
                      <div className="comp-bar-top">
                        <span className="comp-name">{comp.name}</span>
                        <span className="blooms-badge">Bloom's Target: {comp.bloomsLevelTarget}</span>
                      </div>
                      <p className="comp-desc">{comp.description}</p>
                      <div className="bar-track-wrapper">
                        <div className="track-bar">
                          <div className="fill cyan" style={{ width: `${comp.currentScorePct}%` }} />
                        </div>
                        <span className="bar-score">{comp.currentScorePct}% / {comp.requiredTargetScorePct}% (Gap: {comp.gapPct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aligned iGOT Karmayogi Course Pathways */}
              <div className="igot-recommended-section">
                <h4>Recommended iGOT Karmayogi Learning Pathway</h4>
                <div className="courses-horizontal-grid">
                  {courses.map(crs => (
                    <div key={crs.courseId} className="igot-card">
                      <div className="igot-top">
                        <Award size={18} className="icon-purple" />
                        <span className="provider-tag">{crs.provider}</span>
                      </div>
                      <h5>{crs.title}</h5>
                      <div className="igot-meta">
                        <span>{crs.durationHours} Hours • {crs.modulesCount} Modules</span>
                        <span className="blooms-tag">Focus: {crs.bloomsFocus}</span>
                      </div>
                      <div className="igot-footer">
                        <span className="completion-rate">Pass Rate: <strong>{crs.completionRatePct}%</strong></span>
                        <button onClick={handleTriggerIGOTSync} className="btn-enroll-igot">Enroll via iGOT</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: AI DOCUMENT NLP MCQ / QUIZ GENERATOR --- */}
      {activeTab === 'nlp_quiz' && (
        <div className="sih-panel-view fade-in">
          <div className="sih-section-header">
            <h3>AI-Powered Document NLP MCQ & Assessment Generator</h3>
            <p>Upload or paste official learning materials (PDF/DOCX/TXT) to automatically extract statistical concepts and generate Bloom's Taxonomy classified quizzes.</p>
          </div>

          <div className="nlp-upload-section">
            <div className="nlp-box-header">
              <Upload size={18} className="icon-cyan" />
              <span>Input Learning Material (Official Statistics Course Module / Survey Manual)</span>
            </div>
            <textarea
              className="nlp-textarea"
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste course text or document content..."
            />
            <div className="nlp-action-bar">
              <button onClick={handleGenerateNLPQuizzes} className="btn-nlp-generate">
                <Zap size={16} />
                <span>Parse Document & Generate Bloom's Taxonomy MCQs</span>
              </button>
            </div>
          </div>

          {feedbackNotice && (
            <div className="sih-alert-banner">
              <CheckCircle className="icon-emerald" size={20} />
              <div>{feedbackNotice}</div>
            </div>
          )}

          {/* Generated MCQs Display */}
          <div className="generated-mcqs-container">
            <div className="mcq-list-header">
              <h4>Generated Assessment Items ({generatedQuizzes.length} Questions)</h4>
              <span className="mcq-sub">Classified by Bloom's Taxonomy & Distractor Fallacy Logic</span>
            </div>

            <div className="mcqs-grid">
              {generatedQuizzes.map((q, idx) => {
                const selectedIdx = selectedAnswers[q.id];
                const isCorrect = selectedIdx !== undefined && q.options[selectedIdx]?.isCorrect;

                return (
                  <div key={q.id} className="sih-mcq-card">
                    <div className="mcq-card-top">
                      <span className="q-number">Q{idx + 1}.</span>
                      <span className="blooms-pill">{q.bloomsLevel}</span>
                      <span className="domain-pill">{q.domainCategory}</span>
                      <button
                        onClick={() => handleToggleQuizApproval(q.id)}
                        className={`status-chip ${q.status === 'Approved' ? 'approved' : 'pending'}`}
                      >
                        {q.status || 'Pending Review'}
                      </button>
                    </div>

                    <div className="q-text">{q.questionText}</div>

                    <div className="options-stack">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selectedIdx === oIdx;
                        let btnStyle = 'option-row';
                        if (showQuizResults) {
                          if (opt.isCorrect) btnStyle += ' correct';
                          else if (isSelected && !opt.isCorrect) btnStyle += ' wrong';
                        } else if (isSelected) {
                          btnStyle += ' selected';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(q.id, oIdx)}
                            className={btnStyle}
                          >
                            <span className="opt-lbl">{opt.label}.</span>
                            <span className="opt-txt">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showQuizResults && (
                      <div className="explanation-box">
                        <div className="exp-head">
                          <CheckCircle size={15} className={isCorrect ? 'icon-emerald' : 'icon-red'} />
                          <span>{isCorrect ? 'Correct Answer' : 'Incorrect Choice'}</span>
                        </div>
                        <p>{q.explanation}</p>
                        <div className="distractor-info">
                          <span>Distractor Logic: <strong>{q.distractorFallacyType}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="quiz-bottom-actions">
              <button onClick={handleVerifyAnswersAndLoopSkillGap} className="btn-verify-answers">
                Verify Answers & Update Skill-Gap (Closed-Loop)
              </button>
              <button onClick={handleGenerateNLPQuizzes} className="btn-regen-quizzes">
                <RefreshCw size={14} />
                <span>Regenerate MCQs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: IGOT ECOSYSTEM API TELEMETRY & SYNC --- */}
      {activeTab === 'igot_api' && (
        <div className="sih-panel-view fade-in">
          <div className="sih-section-header">
            <h3>iGOT Karmayogi Ecosystem Integration & API Telemetry</h3>
            <p>Simulated real-time API sync schema connecting MoSPI DIID capacity platform to National iGOT Karmayogi Servers.</p>
          </div>

          <div className="api-telemetry-grid">
            <div className="telemetry-card">
              <div className="tel-head">
                <Server size={18} className="icon-emerald" />
                <span>iGOT OAuth 2.0 Auth Server</span>
              </div>
              <div className="tel-status active">ONLINE (HTTP 200 OK)</div>
              <div className="tel-endpoint">https://igotkarmayogi.gov.in/api/v2/auth/verify</div>
            </div>

            <div className="telemetry-card">
              <div className="tel-head">
                <Layers size={18} className="icon-cyan" />
                <span>Competency Registry Schema</span>
              </div>
              <div className="tel-status active">SYNCED (195 Cadres)</div>
              <div className="tel-endpoint">https://igotkarmayogi.gov.in/api/v2/competency/mospi</div>
            </div>

            <div className="telemetry-card">
              <div className="tel-head">
                <FileText size={18} className="icon-purple" />
                <span>Course Telemetry Pipeline</span>
              </div>
              <div className="tel-status active">ACTIVE (14,200 Officials)</div>
              <div className="tel-endpoint">https://igotkarmayogi.gov.in/api/v2/telemetry/progress</div>
            </div>
          </div>

          {/* Raw JSON Schema Inspector */}
          <div className="schema-inspector-box">
            <div className="schema-header">
              <FileText size={16} className="icon-cyan" />
              <span>iGOT Karmayogi API Payload Schema (MoSPI DIID Endpoint)</span>
            </div>
            <pre className="json-schema-code">
{`{
  "system": "MoSPI DIID Capacity Building Platform",
  "problemStatementId": "26101",
  "ministry": "Ministry of Statistics and Programme Implementation",
  "cadreCoverage": ["ISS", "SSS", "FOD", "SDRD", "DPD", "DIID"],
  "apiTelemetry": {
    "authProtocol": "OAuth 2.0 / iGOT SSO",
    "competencyMappingStandard": "NSSTA Official Statistics Matrix 2026",
    "aiQuizEngine": "Bloom's Taxonomy NLP Generator v1.0",
    "totalOfficialsEnrolled": 14200,
    "averageReadinessIndexPct": 76.4
  }
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
