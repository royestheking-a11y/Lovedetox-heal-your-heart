import { HeroSection } from '../components/sections/HeroSection';
import { PainPointsSection } from '../components/sections/PainPointsSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { PricingSection } from '../components/sections/PricingSection';
import { FAQSection } from '../components/sections/FAQSection';
import { CTASection } from '../components/sections/CTASection';
import { ContactSection } from '../components/sections/ContactSection';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const navigate = useNavigate();

    const handleStartFree = () => {
        navigate('/register');
    };

    const handleTalkToAI = () => {
        // Logic for guest chat or redirect
        navigate('/register'); // Or open guest chat modal if implemented globally
    };

    const scrollToPainPoints = () => {
        document.getElementById('pain-points')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <HeroSection
                onStartFree={handleStartFree}
                onTalkToAI={handleTalkToAI}
                onScrollToPainPoints={scrollToPainPoints}
            />
            <PainPointsSection />
            <FeaturesSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <PricingSection onStartFree={handleStartFree} />
            <FAQSection />
            <CTASection onStartFree={handleStartFree} onTalkToAI={handleTalkToAI} />
            <ContactSection />
        </>
    );
}
