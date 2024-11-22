import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import scalable from "@/assets/scalable.jpg";
import integrate from "@/assets/integrate.jpg";
import secure from "@/assets/secure.jpg";
import performance from "@/assets/performance.jpg";
import support from "@/assets/support.jpg";
import './FeaturesSection.css'; // Import the custom CSS file for styles

const FeaturesSection = () => {
    const features = [
        { title: "Fast Performance", description: "Blazing-fast load times for your websites.", imgSrc: performance },
        { title: "24/7 Support", description: "Our team is here to help you anytime.", imgSrc: support },
        { title: "Scalability", description: "Easily scale with growing traffic.", imgSrc: scalable},
        { title: "Secure Hosting", description: "Top-notch security for your data.", imgSrc: secure },
        { title: "Easy Integration", description: "Seamless integration with popular platforms.", imgSrc: integrate },
    ];

    return (
        <section className="py-12 bg-gray-900 text-white">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-8">Our Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="feature-card bg-black/50 p-4 glow-border">
                            <div className="card-image-container">
                                <img src={feature.imgSrc} alt={feature.title} className="feature-image" />
                            </div>
                            <CardHeader>
                                <CardTitle className="feature-title text-lg font-semibold glowing-text">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-white/90">{feature.description}</CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
