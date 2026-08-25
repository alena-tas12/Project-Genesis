import React, { useState } from 'react';
import { KarmayogiEngine, type OfficialStatisticianCompetency, type IGOTCourseRecommendation, type GeneratedQuizMCQ } from '../../engine/capacity/karmayogiEngine';
import { Award, BookOpen, Brain, CheckCircle, FileText, HelpCircle, RefreshCw, Zap } from 'lucide-react';

export const KarmayogiCompetencyView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'gaps' | 'pathways' | 'quizgen'>('gaps');
  const [competencies] = useState<OfficialStatisticianCompetency[]>(() => KarmayogiEngine.assessCompetencyGaps('Statistical Officer'));
  const [courses] = useState<IGOTCourseRecommendation[]>(() => KarmayogiEngine.getRecommendedCourses(competencies));
  
  // Quiz Generator State
  const [uploadedMaterial, setUploadedMaterial] = useState<string>(
    'India Statistical System Capacity Building Module 2026:\nIntegrating Big Data Analytics, Satellite GIS, and Machine Learning algorithms into national sample survey designs for MoSPI DIID data informatics.'
  );
  const [generatedQuizzes, setGeneratedQuizzes] = useState<GeneratedQuizMCQ[]>(() => KarmayogiEngine.generateMCQsFromText(uploadedMaterial));
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleGenerateQuizzes = () => {
    const quizzes = KarmayogiEngine.generateMCQsFromText(uploadedMaterial);
    setGeneratedQuizzes(quizzes);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleSelectOption = (quizId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [quizId]: optionIndex }));
  };

  return (
    <div className="capacity-container fade-in">
      {/* SIH Problem Statement Banner */}
      <div className="sih-banner-box">
        <div className="sih-badge-group">
          <span className="sih-badge-id">SIH Problem Statement ID: 26101</span>
          <span className="sih-badge-org">MoSPI — Data Informatics & Innovation Division (DIID)</span>
        </div>
        <h2>iGOT Karmayogi Competency Gap & AI Quiz Generator Engine</h2>
        <p className="subtitle">
          AI-enabled learning platform identifying competency gaps, recommending personalized training through iGOT Karmayogi, and generating MCQs from learning materials to strengthen India's Official Statistical System.
        </p>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="tab-switcher-pills">
        <button
          onClick={() => setActiveSubTab('gaps')}
          className={`subtab-pill ${activeSubTab === 'gaps' ? 'active' : ''}`}
        >
          <Brain size={16} />
          <span>Skill-Gap Assessment</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pathways')}
          className={`subtab-pill ${activeSubTab === 'pathways' ? 'active' : ''}`}
        >
          <BookOpen size={16} />
          <span>iGOT Karmayogi Pathways</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quizgen')}
          className={`subtab-pill ${activeSubTab === 'quizgen' ? 'active' : ''}`}
        >
          <HelpCircle size={16} />
          <span>AI MCQ & Quiz Generator</span>
        </button>
      </div>

      {/* View 1: Competency Gap Assessment */}
      {activeSubTab === 'gaps' && (
        <div className="gaps-view-layout">
          <div className="panel-header">
            <h3>MoSPI Official Statistics Competency Matrix</h3>
            <span className="panel-sub">Targeted skill-gap identification across statistical domains</span>
          </div>

          <div className="gaps-grid">
            {competencies.map(comp => (
              <div key={comp.domain} className="gap-card">
                <div className="gap-card-header">
                  <span className="gap-domain">{comp.domain}</span>
                  <span className="gap-cat-badge">{comp.category}</span>
                </div>

                <div className="gap-stat-bars">
                  <div className="bar-stat-label">
                    <span>Current Level vs Required Target</span>
                    <span className="val-cyan">{comp.currentLevelPct}% / {comp.targetRequiredLevelPct}%</span>
                  </div>
                  <div className="track">
                    <div className="fill cyan" style={{ width: `${comp.currentLevelPct}%` }} />
                  </div>
                </div>

                <div className="gap-footer">
                  <span className="gap-text">Competency Gap: <strong>{comp.gapPct}%</strong></span>
                  <span className="priority-pill">{comp.gapPct > 35 ? 'High Upskilling Priority' : 'Moderate Priority'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Personalized iGOT Pathways */}
      {activeSubTab === 'pathways' && (
        <div className="pathways-view-layout">
          <div className="panel-header">
            <h3>Personalized iGOT Karmayogi Learning Pathways</h3>
            <span className="panel-sub">Course recommendations aligned with job roles and identified skill gaps</span>
          </div>

          <div className="courses-grid">
            {courses.map(course => (
              <div key={course.courseId} className="course-card">
                <div className="course-top">
                  <Award className="icon-purple" size={20} />
                  <span className="provider-badge">{course.provider}</span>
                </div>
                <h4>{course.courseTitle}</h4>
                <div className="course-meta">
                  <span>Domain: <strong>{course.domain}</strong></span>
                  <span>Duration: <strong>{course.durationHours} Hours</strong></span>
                </div>
                <div className="course-roles">
                  <span className="roles-label">Aligned Job Roles:</span>
                  <div className="roles-chips">
                    {course.alignedJobRoles.map(role => (
                      <span key={role} className="role-chip">{role}</span>
                    ))}
                  </div>
                </div>
                <div className="course-footer">
                  <span className="relevance-score">Relevance Score: <strong>{course.relevanceScorePct}%</strong></span>
                  <button className="btn-enroll">Enroll via iGOT</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: AI MCQ & Quiz Generator */}
      {activeSubTab === 'quizgen' && (
        <div className="quizgen-view-layout">
          <div className="panel-header">
            <h3>AI MCQ & Quiz Generator from Learning Materials</h3>
            <span className="panel-sub">Upload or paste course text to automatically generate structured Multiple Choice Questions</span>
          </div>

          {/* Upload Text Material */}
          <div className="material-upload-box">
            <div className="upload-header">
              <FileText className="icon-cyan" size={18} />
              <span>Learning Material Input (Text / Module Document)</span>
            </div>
            <textarea
              className="material-textarea"
              rows={4}
              value={uploadedMaterial}
              onChange={(e) => setUploadedMaterial(e.target.value)}
              placeholder="Paste training material text here..."
            />
            <div className="upload-actions">
              <button onClick={handleGenerateQuizzes} className="btn-generate-quiz">
                <Zap size={16} />
                <span>Generate Quizzes & MCQs (AI Engine)</span>
              </button>
            </div>
          </div>

          {/* Generated MCQs */}
          <div className="mcq-list-container">
            <h4>Generated MCQs ({generatedQuizzes.length} Questions)</h4>
            {generatedQuizzes.map((quiz, idx) => {
              const selectedIdx = selectedAnswers[quiz.id];
              const isCorrect = selectedIdx === quiz.correctOptionIndex;

              return (
                <div key={quiz.id} className="mcq-card">
                  <div className="mcq-header">
                    <span className="mcq-num">Q{idx + 1}.</span>
                    <span className="mcq-question">{quiz.question}</span>
                    <span className="difficulty-tag">{quiz.difficulty}</span>
                  </div>

                  <div className="mcq-options-grid">
                    {quiz.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedIdx === optIdx;
                      let optionClass = 'mcq-option-btn';
                      if (showResults) {
                        if (optIdx === quiz.correctOptionIndex) optionClass += ' correct';
                        else if (isOptionSelected && !isCorrect) optionClass += ' wrong';
                      } else if (isOptionSelected) {
                        optionClass += ' selected';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(quiz.id, optIdx)}
                          className={optionClass}
                        >
                          <span className="opt-letter">{String.fromCharCode(65 + optIdx)}.</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {showResults && (
                    <div className="mcq-explanation-box">
                      <div className="exp-title">
                        <CheckCircle size={16} className={isCorrect ? 'icon-emerald' : 'icon-red'} />
                        <span>{isCorrect ? 'Correct Answer!' : 'Incorrect'}</span>
                      </div>
                      <p>{quiz.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="quiz-submit-bar">
              <button onClick={() => setShowResults(true)} className="btn-submit-quiz">
                Submit & Verify Quiz Answers
              </button>
              <button onClick={handleGenerateQuizzes} className="btn-reset-quiz">
                <RefreshCw size={14} />
                <span>Regenerate Questions</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
