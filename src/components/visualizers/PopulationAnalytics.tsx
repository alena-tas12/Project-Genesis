import React, { useState } from 'react';
import type { StudentAgent, TeacherAgent } from '../../engine/types';
import { Users, GraduationCap, UserCheck, Target, Bus, MapPin, Award, BookOpen } from 'lucide-react';

interface PopulationAnalyticsProps {
  students: StudentAgent[];
  teachers: TeacherAgent[];
}

export const PopulationAnalytics: React.FC<PopulationAnalyticsProps> = ({ students, teachers }) => {
  const [activeSubTab, setActiveSubTab] = useState<'students' | 'teachers'>('students');
  const [selectedStudent, setSelectedStudent] = useState<StudentAgent | null>(students[0] || null);

  return (
    <div className="population-container">
      <div className="pop-header">
        <div>
          <h2>Multi-Agent Lifelong Population Analytics</h2>
          <p className="subtitle">
            Emergent agent dynamics across 7 Lifelong Education Stages, Degree Attainment levels, and Gatekeeper Entrance Exams.
          </p>
        </div>

        <div className="tab-switcher-pills">
          <button
            onClick={() => setActiveSubTab('students')}
            className={`subtab-pill ${activeSubTab === 'students' ? 'active' : ''}`}
          >
            <Users size={16} />
            <span>Lifelong Learners ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('teachers')}
            className={`subtab-pill ${activeSubTab === 'teachers' ? 'active' : ''}`}
          >
            <GraduationCap size={16} />
            <span>Faculty Members ({teachers.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'students' ? (
        <div className="students-layout">
          {/* Students Table */}
          <div className="table-responsive flex-1">
            <table className="population-table">
              <thead>
                <tr>
                  <th>Learner Agent</th>
                  <th>Age & Life Stage</th>
                  <th>Degree Attainment</th>
                  <th>Entrance Exam</th>
                  <th>Curiosity</th>
                  <th>Stress</th>
                  <th>Stamina / Energy</th>
                  <th>Burnout</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const isSelected = selectedStudent?.id === s.id;
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedStudent(s)}
                      className={`row-clickable ${isSelected ? 'row-selected' : ''}`}
                    >
                      <td>
                        <div className="agent-identity">
                          <UserCheck size={16} className="icon-cyan" />
                          <span className="agent-name">{s.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="val-bar">
                          <span className="m-val">Age {s.age}</span>
                          <span className="pop-pill">{s.lifeStage.replace('_', ' ').toUpperCase()}</span>
                        </div>
                      </td>
                      <td>
                        <div className="val-bar">
                          <Award size={13} className="icon-purple" />
                          <span>{s.degreeLevel}</span>
                        </div>
                      </td>
                      <td>
                        <div className="val-bar">
                          <BookOpen size={13} className="icon-amber" />
                          <span className="val-cyan">{s.entranceExamScore.toFixed(0)}/100</span>
                        </div>
                      </td>
                      <td>
                        <div className="val-bar">
                          <div className="bar-fill cyan" style={{ width: `${s.curiosity}%` }} />
                          <span>{s.curiosity.toFixed(0)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="val-bar">
                          <div className="bar-fill red" style={{ width: `${s.stress}%` }} />
                          <span>{s.stress.toFixed(0)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="val-bar">
                          <div className="bar-fill green" style={{ width: `${s.energy}%` }} />
                          <span>{s.energy.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`burnout-tag ${s.burnout > 40 ? 'high' : 'ok'}`}>
                          {s.burnout.toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Student Detailed Card */}
          {selectedStudent && (
            <div className="agent-detail-panel">
              <div className="panel-top">
                <Target size={20} className="icon-cyan" />
                <div>
                  <h3>{selectedStudent.name}</h3>
                  <span className="career-sub">{selectedStudent.careerGoal}</span>
                </div>
              </div>

              <div className="inspect-row">
                <span className="label"><BookOpen size={12} /> Life Stage</span>
                <span className="val-cyan">{selectedStudent.lifeStage.replace('_', ' ').toUpperCase()} (Age {selectedStudent.age})</span>
              </div>

              <div className="inspect-row">
                <span className="label"><Award size={12} /> Highest Degree</span>
                <span className="val-purple">{selectedStudent.degreeLevel}</span>
              </div>

              <div className="inspect-row">
                <span className="label"><BookOpen size={12} /> Gatekeeper Exam</span>
                <span className="val-cyan">{selectedStudent.entranceExamScore.toFixed(1)} / 100</span>
              </div>

              <div className="inspect-row">
                <span className="label"><MapPin size={12} /> Travel Distance</span>
                <span className="val">{selectedStudent.commuteDistanceKm} km ({selectedStudent.transportMode.toUpperCase()})</span>
              </div>

              <div className="inspect-row">
                <span className="label"><Bus size={12} /> Commute Time</span>
                <span className="val">{selectedStudent.commuteTimeMins} Minutes</span>
              </div>

              <div className="stat-bars-group">
                <div className="bar-stat">
                  <div className="bar-stat-label">
                    <span>Curiosity</span>
                    <span>{selectedStudent.curiosity.toFixed(1)}/100</span>
                  </div>
                  <div className="track"><div className="fill cyan" style={{ width: `${selectedStudent.curiosity}%` }} /></div>
                </div>

                <div className="bar-stat">
                  <div className="bar-stat-label">
                    <span>Stress Level</span>
                    <span>{selectedStudent.stress.toFixed(1)}/100</span>
                  </div>
                  <div className="track"><div className="fill red" style={{ width: `${selectedStudent.stress}%` }} /></div>
                </div>

                <div className="bar-stat">
                  <div className="bar-stat-label">
                    <span>Daily Stamina & Energy</span>
                    <span>{selectedStudent.energy.toFixed(1)}/100</span>
                  </div>
                  <div className="track"><div className="fill green" style={{ width: `${selectedStudent.energy}%` }} /></div>
                </div>

                <div className="bar-stat">
                  <div className="bar-stat-label">
                    <span>Social Break Satisfaction</span>
                    <span>{selectedStudent.socialSat.toFixed(1)}/100</span>
                  </div>
                  <div className="track"><div className="fill purple" style={{ width: `${selectedStudent.socialSat}%` }} /></div>
                </div>

                <div className="bar-stat">
                  <div className="bar-stat-label">
                    <span>Socioeconomic Baseline</span>
                    <span>{selectedStudent.inequalityFactor.toFixed(1)}/100</span>
                  </div>
                  <div className="track"><div className="fill amber" style={{ width: `${selectedStudent.inequalityFactor}%` }} /></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Teachers View */
        <div className="table-responsive">
          <table className="population-table">
            <thead>
              <tr>
                <th>Teacher Faculty Member</th>
                <th>Teaching Ability</th>
                <th>Subject Mastery</th>
                <th>Mentoring Capacity</th>
                <th>Burnout Rate</th>
                <th>Research Output</th>
                <th>Experience</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="agent-identity">
                      <GraduationCap size={16} className="icon-purple" />
                      <span className="agent-name">{t.name}</span>
                    </div>
                  </td>
                  <td>{t.teachingAbility.toFixed(0)} / 100</td>
                  <td>{t.subjectMastery.toFixed(0)} / 100</td>
                  <td>{t.mentoringCapacity.toFixed(0)} / 100</td>
                  <td>
                    <span className={`burnout-tag ${t.burnout > 35 ? 'high' : 'ok'}`}>
                      {t.burnout.toFixed(0)}%
                    </span>
                  </td>
                  <td>{t.researchOutput.toFixed(0)} / 100</td>
                  <td>{t.experienceYears} Years</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
