import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { CTASection } from '../components/sections/CTASection';
import { useNavigate } from 'react-router-dom';

export function HowItWorks() {
    const navigate = useNavigate();
    return (
        <div className="pt-20">
            <HowItWorksSection />
            <CTASection onStartFree={() => navigate('/register')} onTalkToAI={() => navigate('/register')} />
        </div>
    );
}
