import { PricingSection } from '../components/sections/PricingSection';
import { FAQSection } from '../components/sections/FAQSection';
import { useNavigate } from 'react-router-dom';

export function Pricing() {
    const navigate = useNavigate();
    return (
        <div className="pt-20">
            <PricingSection onStartFree={() => navigate('/register')} />
            <FAQSection />
        </div>
    );
}
