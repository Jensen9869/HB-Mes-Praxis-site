import { Layers, FolderGit2, MessageSquare } from 'lucide-react';

export const ProblemOpportunitySection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-surface border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-accent-ink uppercase mb-2">
            The Bridge to Practice
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-4 text-balance">
            Your degree is a beginning. What you build with it matters.
          </h2>
          <p className="text-base sm:text-lg text-body leading-relaxed">
            Academic knowledge is important. So is knowing how to apply it, communicate your ideas, solve problems and work with others. Our programmes are designed to help you practise these skills in a structured environment and build evidence of your progress.
          </p>
        </div>

        {/* Three Concise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1 */}
          <div className="bg-soft rounded-xl p-6 sm:p-8 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-accent-ink flex items-center justify-center mb-5">
              <Layers className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">
              Knowledge into practice
            </h3>
            <p className="text-sm text-body leading-relaxed">
              Apply what you know through structured tasks and projects.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-soft rounded-xl p-6 sm:p-8 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-ink flex items-center justify-center mb-5">
              <FolderGit2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">
              Skills with evidence
            </h3>
            <p className="text-sm text-body leading-relaxed">
              Build work samples that demonstrate your developing capabilities.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-soft rounded-xl p-6 sm:p-8 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-slate-200 text-ink flex items-center justify-center mb-5">
              <MessageSquare className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">
              Confidence through feedback
            </h3>
            <p className="text-sm text-body leading-relaxed">
              Use guidance, reflection and repeated practice to improve.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
