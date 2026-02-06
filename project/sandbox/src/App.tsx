import React, { useState } from 'react';
import { 
  Home, 
  ListTodo, 
  User, 
  Battery, 
  Wifi, 
  ChevronRight, 
  Settings, 
  Bell, 
  BrainCircuit, 
  ShieldCheck, 
  Download, 
  HelpCircle, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  BarChart3,
  Timer,
  Zap,
  BookOpen,
  History,
  ArrowLeft,
  Smartphone,
  Volume2,
  Moon,
  Trash2,
  FileText,
  Mail,
  MessageCircle,
  ChevronDown,
  Sliders,
  Camera,
  Pencil,
  Save,
  Flame // Added specifically for the "Burn Brain" difficulty
} from 'lucide-react';

// --- Components ---

/**
 * Reusable Card Component
 */
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 ${className}`}>
    {children}
  </div>
);

/**
 * Reusable Toggle Switch Component
 */
const Toggle = ({ checked, onChange }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-teal-500' : 'bg-slate-200'}`}
  >
    <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${checked ? 'left-[22px]' : 'left-0.5'}`} />
  </button>
);

/**
 * Badge Component for Status
 */
const StatusBadge = ({ status }) => {
  const styles = {
    focused: "bg-emerald-100 text-emerald-700 border-emerald-200",
    distracted: "bg-amber-100 text-amber-700 border-amber-200",
    idle: "bg-slate-100 text-slate-600 border-slate-200",
  };
  
  const config = {
    focused: { label: "专注中", color: "bg-emerald-500" },
    distracted: { label: "分心", color: "bg-amber-500" },
    idle: { label: "空闲", color: "bg-slate-400" },
  };

  const current = config[status.toLowerCase()] || config.idle;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status.toLowerCase()] || styles.idle}`}>
      <span className={`w-2 h-2 rounded-full ${current.color} animate-pulse`} />
      {current.label}
    </div>
  );
};

// --- Sub-View: Add Task (New Feature) ---

const AddTaskView = ({ onBack }) => {
  const [subject, setSubject] = useState('数学');
  const [difficulty, setDifficulty] = useState('适中');
  const [workload, setWorkload] = useState('moderate');
  const [taskText, setTaskText] = useState('');
  
  // Demo pending tasks list
  const [pendingTasks, setPendingTasks] = useState([
    { id: 1, subject: '数学', title: '口算练习 20 道', difficulty: '轻松', color: 'bg-indigo-500' }
  ]);

  const subjects = [
    { id: '数学', color: 'bg-indigo-500' }, 
    { id: '语文', color: 'bg-rose-500' }, 
    { id: '英语', color: 'bg-orange-500' }, 
    { id: '科学', color: 'bg-teal-500' }, 
    { id: '阅读', color: 'bg-blue-500' }
  ];
  
  const difficulties = [
    { id: '轻松', label: '轻松', icon: '😌' },
    { id: '适中', label: '适中', icon: '🙂' },
    { id: '烧脑', label: '烧脑', icon: '🤯' },
  ];

  const handleAddTask = () => {
    if (!taskText) return;
    const newId = pendingTasks.length + 1;
    const subColor = subjects.find(s => s.id === subject)?.color || 'bg-slate-400';
    setPendingTasks([...pendingTasks, { 
      id: newId, 
      subject, 
      title: taskText, 
      difficulty, 
      color: subColor 
    }]);
    setTaskText('');
  };

  return (
    <div className="flex flex-col h-full min-h-[80vh] bg-slate-50 relative animate-in slide-in-from-right duration-300 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-50/90 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full -ml-2 text-slate-600 transition-colors">
            <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">添加今日任务</h2>
        <button 
          onClick={() => { setTaskText(''); setPendingTasks([]); }}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
        >
          重置
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-6 pt-2 no-scrollbar">
         {/* Subject Selector */}
         <div>
           <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar items-center">
              {subjects.map(sub => (
                  <button
                      key={sub.id}
                      onClick={() => setSubject(sub.id)}
                      className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                          subject === sub.id 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 border-indigo-600 scale-105'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-200'
                      }`}
                  >
                      {sub.id}
                  </button>
              ))}
           </div>
         </div>

         {/* Input Card */}
         <Card className="p-6 space-y-6">
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">任务内容</label>
                <textarea 
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    placeholder="例如：完成第 15-18 页练习题..."
                    className="w-full text-lg text-slate-800 placeholder:text-slate-300 resize-none outline-none border-b border-slate-100 pb-2 focus:border-indigo-500 transition-colors bg-transparent"
                    rows={2}
                />
            </div>

            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">预估难度</label>
                <div className="grid grid-cols-3 gap-3">
                    {difficulties.map(diff => {
                        const isSelected = difficulty === diff.id;
                        const isBurn = diff.id === '烧脑';
                        
                        let activeClass = "";
                        if (isSelected) {
                            if (isBurn) activeClass = "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200 ring-2 ring-orange-100";
                            else activeClass = "bg-slate-800 border-slate-800 text-white shadow-md ring-2 ring-slate-100";
                        } else {
                           activeClass = "bg-white border-slate-200 text-slate-500 hover:bg-slate-50";
                        }

                        return (
                          <button
                              key={diff.id}
                              onClick={() => setDifficulty(diff.id)}
                              className={`py-3 rounded-xl text-sm font-medium transition-all border flex flex-col items-center gap-1 ${activeClass}`}
                          >
                              <span className="text-lg">{diff.icon}</span>
                              {diff.label}
                          </button>
                        );
                    })}
                </div>
            </div>
            
            {/* Workload */}
             <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">预估题量</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['少量', '适中', '大量'].map((w) => (
                      <button 
                        key={w}
                        onClick={() => setWorkload(w)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          workload === w 
                          ? 'bg-white text-indigo-600 shadow-sm font-bold' 
                          : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                </div>
            </div>

             <button 
                onClick={handleAddTask}
                className="w-full py-3.5 rounded-xl border border-dashed border-slate-300 text-slate-500 font-medium flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-500 transition-all active:scale-[0.99]"
             >
                <Plus size={18} />
                添加到待定列表
            </button>
         </Card>

         {/* Pending List */}
         {pendingTasks.length > 0 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between px-1">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">待提交 ({pendingTasks.length})</h3>
                </div>
                {pendingTasks.map(task => (
                    <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-10 rounded-full ${task.color}`}></div>
                            <div>
                                <h4 className="font-bold text-slate-700 text-sm mb-0.5">{task.title}</h4>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">{task.subject}</span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${task.difficulty === '烧脑' ? 'text-orange-600 bg-orange-50 border-orange-100' : 'text-slate-400 bg-white border-slate-100'}`}>
                                    {task.difficulty}
                                  </span>
                                </div>
                            </div>
                        </div>
                        <button 
                          onClick={() => setPendingTasks(pendingTasks.filter(t => t.id !== task.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
         )}
      </div>

      {/* Footer Action - Floating */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-20 flex justify-center">
         <div className="w-full max-w-[430px]">
            <button 
                onClick={onBack} 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl"></div>
                <Sparkles size={20} className="animate-pulse" />
                <span className="relative">生成智能学习计划</span>
            </button>
         </div>
      </div>
    </div>
  );
};

// --- View 1: Assessment (Home) ---

const AssessmentView = () => {
  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm">
              <span className="text-2xl">🦁</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">小乐</h1>
            <p className="text-sm text-slate-500">学习模式进行中</p>
          </div>
        </div>
        <StatusBadge status="focused" />
      </div>

      {/* Core Assessment Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Zap size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">专注力</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">4.2<span className="text-sm text-slate-400 font-normal">/5</span></div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-1.5 bg-indigo-500 rounded-full" />)}
            <div className="w-full h-1.5 bg-slate-200 rounded-full" />
          </div>
          <p className="text-xs text-slate-500 mt-1">今日状态非常稳定</p>
        </Card>

        <Card className="p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-teal-600 mb-1">
            <CheckCircle2 size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">效率</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">92%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-teal-500 w-[92%] h-full rounded-full" />
          </div>
          <p className="text-xs text-slate-500 mt-1">任务完成迅速</p>
        </Card>

        <Card className="p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <AlertCircle size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">干扰次数</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">低</div>
          <p className="text-xs text-slate-500 leading-tight">过去一小时仅检测到 2 次轻微干扰。</p>
        </Card>

        <Card className="p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-rose-500 mb-1">
            <Timer size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">持续时长</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">25分</div>
          <p className="text-xs text-slate-500 leading-tight">建议单次连续专注学习时长。</p>
        </Card>
      </div>

      {/* Visual Summary (Custom SVG Radar Chart) */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">能力雷达</h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">今日平均</span>
        </div>
        
        <div className="relative h-48 flex items-center justify-center">
          {/* Chart Labels */}
          <div className="absolute top-0 text-xs font-medium text-slate-500">专注</div>
          <div className="absolute bottom-0 left-4 text-xs font-medium text-slate-500">效率</div>
          <div className="absolute bottom-0 right-4 text-xs font-medium text-slate-500">耐力</div>

          <svg viewBox="0 0 100 100" className="w-full h-full max-w-[200px] overflow-visible">
            {/* Background Triangle (Grid) */}
            <polygon points="50,10 90,80 10,80" fill="none" stroke="#E2E8F0" strokeWidth="1" />
            <polygon points="50,33 76,70 24,70" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Data Polygon */}
            <polygon 
              points="50,15 85,75 20,78" 
              fill="rgba(13, 148, 136, 0.2)" 
              stroke="#0D9488" 
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Data Points */}
            <circle cx="50" cy="15" r="3" fill="#0D9488" />
            <circle cx="85" cy="75" r="3" fill="#0D9488" />
            <circle cx="20" cy="78" r="3" fill="#0D9488" />
          </svg>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">整体表现均衡，耐力有待提升。</p>
      </Card>

      {/* AI Insight Panel */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100 relative overflow-hidden">
        <div className="flex items-start gap-3 relative z-10">
          <div className="bg-white p-2 rounded-xl shadow-sm text-indigo-600">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 mb-1">AI 洞察</h3>
            <p className="text-sm text-indigo-800 leading-relaxed">
              小乐在 <span className="font-semibold bg-white/50 px-1 rounded">25–30 分钟</span> 的专注时段表现最佳。建议在下一个数学任务后安排一次休息，以保持高效。
            </p>
          </div>
        </div>
        {/* Decorative Background Elements */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl"></div>
        <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

// --- View 2: Tasks ---

const TasksView = () => {
  const [isAddingTask, setIsAddingTask] = useState(false);

  if (isAddingTask) {
    return <AddTaskView onBack={() => setIsAddingTask(false)} />;
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-bold text-slate-800">任务列表</h1>
        <button 
          onClick={() => setIsAddingTask(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-slate-200 hover:bg-slate-800 transition-colors"
        >
          <Plus size={16} />
          <span>添加任务</span>
        </button>
      </div>

      {/* Current Task Plan */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">今日计划</h2>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Sparkles size={12} className="text-teal-500" />
            AI 智能排序
          </span>
        </div>

        <div className="space-y-3">
          {/* Task 1 */}
          <Card className="p-0 overflow-hidden relative group">
             {/* Progress Strip */}
             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500" />
             <div className="p-4 pl-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">数学</span>
                    <span className="bg-teal-50 text-teal-600 border border-teal-100 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1">
                      <Sparkles size={10} /> 最佳起步
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-lg">一元一次方程练习</h3>
                <div className="flex items-center gap-4 mt-3 text-slate-500 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>25 分钟</span>
                  </div>
                  <div className="h-3 w-[1px] bg-slate-300"></div>
                  <span>高专注需求</span>
                </div>
             </div>
          </Card>

          {/* Task 2 */}
          <Card className="p-0 overflow-hidden relative opacity-75">
             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-400" />
             <div className="p-4 pl-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">英语</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-lg">单词复习 & 听写</h3>
                <div className="flex items-center gap-4 mt-3 text-slate-500 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>15 分钟</span>
                  </div>
                  <div className="h-3 w-[1px] bg-slate-300"></div>
                  <span>中等难度</span>
                </div>
             </div>
          </Card>
        </div>

        <div className="mt-3 flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
           <BrainCircuit size={16} className="text-slate-400 mt-0.5 shrink-0" />
           <p className="text-xs text-slate-500 leading-relaxed">
             任务顺序已优化：先安排高认知的数学任务，再安排轻松的英语复习，以利用大脑黄金时间并减少后期疲劳。
           </p>
        </div>
      </section>

      {/* History Section */}
      <section>
        <div className="flex items-center gap-2 mb-4 mt-8">
          <History size={18} className="text-slate-400" />
          <h2 className="text-lg font-bold text-slate-800">历史记录</h2>
        </div>

        <div className="space-y-4 relative before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-[2px] before:bg-slate-100">
          {[
            { title: "科学测验准备", date: "昨天", est: 20, act: 22, status: "complete" },
            { title: "语文阅读练习", date: "昨天", est: 30, act: 25, status: "complete" }
          ].map((task, idx) => (
            <div key={idx} className="relative pl-10">
              {/* Timeline Dot */}
              <div className="absolute left-[13px] top-2 w-3.5 h-3.5 bg-teal-100 border-2 border-teal-500 rounded-full z-10"></div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-slate-700">{task.title}</h4>
                  <span className="text-xs text-slate-400">{task.date}</span>
                </div>
                
                {/* Visual Time Comparison */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-slate-400">预估</span>
                    <div className="h-2 rounded-full bg-slate-200" style={{ width: `${task.est * 2}px` }}></div>
                    <span className="text-slate-400">{task.est}分</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-teal-600 font-medium">实际</span>
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: `${task.act * 2}px` }}></div>
                    <span className="text-teal-600 font-medium">{task.act}分</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- View 3: Profile & Sub-Views ---

const EditChildProfile = ({ onBack }) => {
  const [habit, setHabit] = useState('visual');
  const [duration, setDuration] = useState(45);

  return (
    <div className="space-y-6 pb-24 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between pt-4 mb-2">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full -ml-2">
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <h2 className="text-xl font-bold text-slate-800">编辑档案</h2>
        </div>
        <button className="text-teal-600 font-semibold text-sm bg-teal-50 px-3 py-1.5 rounded-full">
          保存
        </button>
      </div>

      {/* Avatar Edit */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-md">
            🦁
          </div>
          <div className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full border-2 border-white shadow-sm">
            <Camera size={14} />
          </div>
        </div>
        <p className="text-xs text-slate-400">点击修改头像</p>
      </div>

      {/* Basic Info */}
      <Card className="p-0 overflow-hidden divide-y divide-slate-50">
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">昵称</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">小乐</span>
            <ChevronRight size={16} className="text-slate-300" />
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">年级</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">四年级</span>
            <ChevronRight size={16} className="text-slate-300" />
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">年龄</span>
          <div className="flex items-center gap-3">
             <button className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">-</button>
             <span className="text-sm font-semibold text-slate-800 w-4 text-center">10</span>
             <button className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">+</button>
          </div>
        </div>
      </Card>

      {/* Study Goals */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1 mb-3">每日目标</h3>
        <Card className="p-5">
          <div className="flex justify-between items-end mb-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Clock size={18} />
              <span className="font-semibold">学习时长</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">{duration} <span className="text-sm font-normal text-slate-400">分钟</span></span>
          </div>
          <input 
            type="range" 
            min="15" 
            max="120" 
            step="5"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" 
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>15m</span>
            <span>2h</span>
          </div>
        </Card>
      </div>

      {/* Learning Habits */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1 mb-3">主要学习风格</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'visual', label: '视觉型', icon: '👀' },
            { id: 'auditory', label: '听觉型', icon: '👂' },
            { id: 'kinesthetic', label: '动觉型', icon: '✋' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setHabit(item.id)}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                habit === item.id 
                  ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2 ml-1">AI 将根据选择的风格优化任务展示方式。</p>
      </div>
    </div>
  );
};

// Sub-components for Settings
const NotificationSettings = ({ onBack }) => {
  const [settings, setSettings] = useState({
    dailyReport: true,
    realTime: true,
    sound: false,
    weekly: true
  });

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6 pb-24 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-3 pt-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full -ml-2">
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">通知设置</h2>
      </div>

      <Card className="divide-y divide-slate-50">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <FileText size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">每日学习报告</p>
              <p className="text-xs text-slate-400">每天晚上 8 点推送日报</p>
            </div>
          </div>
          <Toggle checked={settings.dailyReport} onChange={() => toggle('dailyReport')} />
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <Smartphone size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">实时干扰提醒</p>
              <p className="text-xs text-slate-400">检测到严重分心时通知家长</p>
            </div>
          </div>
          <Toggle checked={settings.realTime} onChange={() => toggle('realTime')} />
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Volume2 size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">任务完成音效</p>
              <p className="text-xs text-slate-400">任务结束时播放提示音</p>
            </div>
          </div>
          <Toggle checked={settings.sound} onChange={() => toggle('sound')} />
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
              <Mail size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">周度总结邮件</p>
              <p className="text-xs text-slate-400">每周日发送详细分析</p>
            </div>
          </div>
          <Toggle checked={settings.weekly} onChange={() => toggle('weekly')} />
        </div>
      </Card>
    </div>
  );
};

const AIModelSettings = ({ onBack }) => {
  const [level, setLevel] = useState(2); // 1: Low, 2: Medium, 3: High

  return (
    <div className="space-y-6 pb-24 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-3 pt-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full -ml-2">
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">AI 模型调整</h2>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4 text-indigo-700">
            <BrainCircuit size={20} />
            <h3 className="font-bold">干预强度</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">设置 AI 在孩子学习时介入提醒的频率和严格程度。</p>
          
          <div className="relative pt-6 pb-2 px-2">
            <div className="h-2 bg-slate-100 rounded-full w-full absolute top-1/2 -translate-y-1/2"></div>
            <div className="flex justify-between relative z-10">
              {[1, 2, 3].map((step) => (
                <button 
                  key={step}
                  onClick={() => setLevel(step)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${level === step ? 'bg-indigo-600 border-indigo-600 text-white scale-110' : 'bg-white border-slate-300 text-slate-400'}`}
                >
                  {step}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs font-medium text-slate-500">
              <span>温和引导</span>
              <span>标准平衡</span>
              <span>严格监督</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-50 pt-6">
           <div className="flex items-center justify-between mb-2">
             <h3 className="font-semibold text-slate-700">专注时段长度</h3>
             <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">25 分钟</span>
           </div>
           <p className="text-xs text-slate-400 mb-4">基于番茄工作法推荐，适合小学生的专注周期。</p>
           <input type="range" className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
           <div className="flex justify-between text-[10px] text-slate-400 mt-1">
             <span>15m</span>
             <span>30m</span>
             <span>45m</span>
           </div>
        </div>
      </Card>

      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-3">
        <Sparkles size={20} className="text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-700 leading-relaxed">
          模型正在学习小乐的习惯。最近数据显示，他在 <span className="font-bold">温和引导</span> 模式下表现出更长的持续专注力，建议保持当前设置。
        </p>
      </div>
    </div>
  );
};

const DataPrivacy = ({ onBack }) => {
  return (
    <div className="space-y-6 pb-24 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-3 pt-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full -ml-2">
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">数据与隐私</h2>
      </div>

      <Card className="divide-y divide-slate-50">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-teal-50 text-teal-600 p-2 rounded-full"><ShieldCheck size={16} /></div>
             <span className="text-sm font-medium text-slate-700">云端数据同步</span>
          </div>
          <Toggle checked={true} onChange={() => {}} />
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-blue-50 text-blue-600 p-2 rounded-full"><BrainCircuit size={16} /></div>
             <div>
               <span className="text-sm font-medium text-slate-700">分享匿名数据</span>
               <p className="text-xs text-slate-400 mt-0.5">帮助改进 AI 模型准确度</p>
             </div>
          </div>
          <Toggle checked={true} onChange={() => {}} />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-slate-700 mb-3">隐私政策摘要</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          我们重视您孩子的隐私。所有摄像头数据仅在本地处理，绝不会上传至云端。音频分析仅用于检测环境噪音水平。
        </p>
        <button className="text-sm text-teal-600 font-medium flex items-center gap-1">
          阅读完整隐私条款 <ChevronRight size={14} />
        </button>
      </Card>

      <button className="w-full py-3 border border-rose-100 text-rose-500 rounded-xl font-medium bg-rose-50 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
        <Trash2 size={18} />
        清空所有本地数据
      </button>
    </div>
  );
};

const ExportReports = ({ onBack }) => {
  return (
    <div className="space-y-6 pb-24 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-3 pt-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full -ml-2">
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">导出学习报告</h2>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-3">选择时间范围</label>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-2 px-4 rounded-lg bg-teal-50 text-teal-700 font-medium border border-teal-200 text-sm">最近 7 天</button>
              <button className="py-2 px-4 rounded-lg bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 text-sm">最近 30 天</button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-3">文件格式</label>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 px-4 py-3 border border-teal-200 bg-teal-50 rounded-xl cursor-pointer w-full">
                 <div className="bg-white p-1.5 rounded text-teal-600 shadow-sm"><FileText size={16} /></div>
                 <span className="text-sm font-medium text-teal-800">PDF 文档</span>
                 <CheckCircle2 size={16} className="ml-auto text-teal-600" />
               </div>
               <div className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl cursor-pointer w-full opacity-60">
                 <div className="bg-slate-100 p-1.5 rounded text-slate-500"><BarChart3 size={16} /></div>
                 <span className="text-sm font-medium text-slate-600">Excel 表格</span>
               </div>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="px-2">
        <p className="text-xs text-slate-400 text-center mb-4">报告将发送至绑定邮箱：sarah.jenkins@example.com</p>
        <button className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-slate-200 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98]">
          <Download size={18} />
          生成并导出
        </button>
      </div>
    </div>
  );
};

const HelpSupport = ({ onBack }) => {
  return (
    <div className="space-y-6 pb-24 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-3 pt-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full -ml-2">
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">帮助与支持</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">常见问题</h3>
        {[
          "专注分是如何计算的？",
          "如何添加新的学习设备？",
          "AI 为什么没有检测到分心？",
          "如何修改孩子的年级信息？"
        ].map((q, i) => (
          <Card key={i} className="p-4 flex justify-between items-center group cursor-pointer hover:border-teal-200 transition-colors">
            <span className="text-sm text-slate-700 font-medium">{q}</span>
            <ChevronDown size={16} className="text-slate-300 group-hover:text-teal-400" />
          </Card>
        ))}
      </div>

      <div className="pt-4">
         <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1 mb-4">联系我们</h3>
         <div className="grid grid-cols-2 gap-4">
            <button className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:bg-indigo-50 hover:border-indigo-100 transition-colors">
               <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                 <MessageCircle size={20} />
               </div>
               <span className="text-sm font-semibold text-slate-700">在线客服</span>
            </button>
            <button className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:bg-teal-50 hover:border-teal-100 transition-colors">
               <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                 <Mail size={20} />
               </div>
               <span className="text-sm font-semibold text-slate-700">发送邮件</span>
            </button>
         </div>
      </div>
    </div>
  );
};

const ProfileView = () => {
  const [subView, setSubView] = useState(null); // 'notification', 'ai', 'privacy', 'export', 'help', 'edit_child'

  // If a subview is active, render it
  if (subView === 'notification') return <NotificationSettings onBack={() => setSubView(null)} />;
  if (subView === 'ai') return <AIModelSettings onBack={() => setSubView(null)} />;
  if (subView === 'privacy') return <DataPrivacy onBack={() => setSubView(null)} />;
  if (subView === 'export') return <ExportReports onBack={() => setSubView(null)} />;
  if (subView === 'help') return <HelpSupport onBack={() => setSubView(null)} />;
  if (subView === 'edit_child') return <EditChildProfile onBack={() => setSubView(null)} />;

  // Default Profile View
  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Top Profile Section */}
      <div className="flex flex-col items-center pt-6 pb-2">
        <div className="w-20 h-20 bg-slate-200 rounded-full overflow-hidden mb-3 border-4 border-white shadow-md">
           {/* Initialize Avatar with a styled div instead of placeholder image */}
           <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-3xl">
              张
           </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800">张女士</h2>
        <p className="text-sm text-slate-500">家长账号</p>
      </div>

      {/* Child Profile Card */}
      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-xl">🦁</div>
            <div>
              <h3 className="font-bold text-slate-800">小乐</h3>
              <p className="text-sm text-slate-500">四年级 • 10岁</p>
            </div>
          </div>
          <button 
            onClick={() => setSubView('edit_child')}
            className="text-xs font-medium text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full hover:bg-teal-100 transition-colors"
          >
            编辑
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
          <div>
             <span className="text-xs text-slate-400 block mb-1">目标时长</span>
             <span className="text-sm font-semibold text-slate-700">45 分钟 / 天</span>
          </div>
          <div>
             <span className="text-xs text-slate-400 block mb-1">习惯类型</span>
             <span className="text-sm font-semibold text-slate-700">视觉型学习者</span>
          </div>
        </div>
      </Card>

      {/* Device Status */}
      <Card className="divide-y divide-slate-50">
         <div className="p-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
               <Wifi size={16} />
             </div>
             <div>
               <p className="text-sm font-medium text-slate-700">iPad Pro (小乐的设备)</p>
               <p className="text-xs text-green-600 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 在线
               </p>
             </div>
           </div>
           <div className="flex items-center gap-1 text-xs text-slate-400">
             <Battery size={14} /> 84%
           </div>
         </div>
      </Card>

      {/* Settings List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
        {[
          { id: 'notification', icon: Bell, label: "通知设置" },
          { id: 'ai', icon: BrainCircuit, label: "AI 模型调整" },
          { id: 'privacy', icon: ShieldCheck, label: "数据与隐私" },
          { id: 'export', icon: Download, label: "导出学习报告" },
          { id: 'help', icon: HelpCircle, label: "帮助与支持" },
        ].map((item) => (
          <button 
            key={item.id} 
            onClick={() => setSubView(item.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        ))}
      </div>

      <div className="text-center pt-4 pb-8">
        <p className="text-xs text-slate-400 mb-4">版本 2.4.0</p>
        <button className="text-sm font-medium text-rose-500 hover:text-rose-600">退出登录</button>
      </div>
    </div>
  );
};

// --- Main App & Navigation ---

export default function App() {
  const [activeTab, setActiveTab] = useState('profile'); // Default to profile for demo

  const navItems = [
    { id: 'assessment', label: '评估', icon: BarChart3 },
    { id: 'tasks', label: '任务', icon: ListTodo },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100">
      
      {/* Main Content Area */}
      <main className="w-full max-w-[430px] mx-auto min-h-screen bg-slate-50 relative shadow-2xl px-5 pt-14 pb-safe">
        
        {/* Dynamic View Rendering */}
        {activeTab === 'assessment' && <AssessmentView />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'profile' && <ProfileView />}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="w-full max-w-[430px] mx-auto bg-white/90 backdrop-blur-lg border-t border-slate-200 pb-8 pt-2 px-6">
            <div className="flex justify-between items-center">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'scale-105' : 'opacity-60 hover:opacity-80'}`}
                  >
                    <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-teal-50 text-teal-600' : 'text-slate-500'}`}>
                      <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className={`text-[10px] font-medium ${isActive ? 'text-teal-700' : 'text-slate-400'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}