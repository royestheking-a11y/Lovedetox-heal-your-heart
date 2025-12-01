import { FeaturesSection } from '../components/sections/FeaturesSection';
import { CTASection } from '../components/sections/CTASection';
import { useNavigate } from 'react-router-dom';

export function Features() {
    const navigate = useNavigate();
    return (
        <div className="pt-20">
            <FeaturesSection />
            <CTASection onStartFree={() => navigate('/register')} onTalkToAI={() => navigate('/register')} />
        </div>
    );
}
