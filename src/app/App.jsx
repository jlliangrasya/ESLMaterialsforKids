import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import Today from '../pages/Today.jsx';
import Students from '../pages/Students.jsx';
import CoursePlan from '../pages/CoursePlan.jsx';
import ClassPlayer from '../pages/ClassPlayer.jsx';
import Lessons, { LessonPage } from '../pages/Lessons.jsx';
import Daily, { DailyTopic } from '../pages/Daily.jsx';
import Stories, { StoryPage } from '../pages/Stories.jsx';
import Quest from '../pages/Quest.jsx';
import Coach from '../pages/Coach.jsx';
import Progress from '../pages/Progress.jsx';
import TeacherGuide from '../pages/TeacherGuide.jsx';
import Settings from '../pages/Settings.jsx';
import { PlayLesson, PlayStory, PlayDaily } from '../pages/Play.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Today />} />
        <Route path="students" element={<Students />} />
        <Route path="plan/:level" element={<CoursePlan />} />
        <Route path="class/:level/:n" element={<ClassPlayer />} />
        <Route path="lessons/:level" element={<Lessons />} />
        <Route path="lessons/:level/:i" element={<LessonPage />} />
        <Route path="daily" element={<Daily />} />
        <Route path="daily/:topic" element={<DailyTopic />} />
        <Route path="stories/:level" element={<Stories />} />
        <Route path="stories/:level/:i" element={<StoryPage />} />
        <Route path="play/lesson/:level/:i" element={<PlayLesson />} />
        <Route path="play/story/:level/:i" element={<PlayStory />} />
        <Route path="play/daily/:topic" element={<PlayDaily />} />
        <Route path="quest" element={<Quest />} />
        <Route path="coach" element={<Coach />} />
        <Route path="progress" element={<Progress />} />
        <Route path="guide" element={<TeacherGuide />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Today />} />
      </Route>
    </Routes>
  );
}
