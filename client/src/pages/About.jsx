import './About.css';

const About = () => {
    return (
        <div className="about-page section-padding">
            <div className="container">
                <div className="about-hero text-center">
                    <h1>Our Story</h1>
                    <p className="subtitle">Zaniza — in every thread.</p>
                </div>

                <div className="about-content">
                    <div className="about-section">
                        <div className="text">
                            <h2>Who We Are</h2>
                            <p>
                                Zaniza was born out of a passion for traditional craftsmanship and modern fashion.
                                Based in the heart of Chittagong, we aim to bring you the finest quality ethnic wear that speaks
                                of elegance and grace.
                            </p>
                        </div>
                        <div className="image">
                            <img
                                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800"
                                alt="Fabric"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/600x400?text=Our+Story';
                                }}
                            />
                        </div>
                    </div>

                    <div className="about-section reverse">
                        <div className="text">
                            <h2>Our Promise</h2>
                            <p>
                                We believe in quality over quantity. Each piece in our collection is handpicked to ensure
                                it meets our high standards. Whether it's a casual cotton kurti or a festive embroidered kameez,
                                we guarantee authenticity.
                            </p>
                        </div>
                        <div className="image">
                            <img
                                src="https://images.unsplash.com/photo-1612459666873-5f164609820e?auto=format&fit=crop&q=80&w=800"
                                alt="Emerald Detail"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/600x400?text=Zaniza+Quality';
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
