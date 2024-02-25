"use client"

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar';
import { MdEmail } from "@react-icons/all-files/md/MdEmail"


const page = () => {
    const { push } = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('token')) {
                setIsLoggedIn(true)
            } else {
                setIsLoggedIn(false)
            }
        }
    }, []);

    const handleEmailClick = () => {
        window.location.href = 'mailto:officialsatstudentguide@gmail.com';
    };

    const TestimonialCard = ({ name, position, comment, avatar }) => {
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg mx-auto mb-8 max-w-sm">
                <img
                    className="w-12 h-12 object-cover rounded-full mx-auto mb-4"
                    src={avatar}
                    alt={`${name}'s Avatar`}
                />
                <h3 className="text-lg font-semibold text-center mb-2">{name}</h3>
                <p className="text-gray-600 text-sm text-center mb-4">{position}</p>
                <p className="text-gray-700 text-center">{comment}</p>
            </div>
        );
    };

    const TestimonialsSection = () => {
        const testimonials = [
            {
                name: 'University of Sindh',
                position: 'Jamshoro',
                comment: 'The platform is intuitive and user-friendly. Truly a game changer in the market.',
                avatar: 'https://usindh.edu.pk/images/usindh/logo.png',
            },
            {
                name: 'Mehran University',
                position: 'Jamshoro',
                comment: 'The classroom management feature helped us create engaging virtual classes. Student Guide is a game-changer!',
                avatar: 'https://crystalpng.com/wp-content/uploads/2022/03/Mehran-University-logo.png',
            },
            {
                name: 'Karachi University',
                position: 'Karachi',
                comment: 'Its course recommendation feature helped our student alot',
                avatar: 'https://seeklogo.com/images/K/karachi-university-logo-B3BDFB034A-seeklogo.com.png',
            },
        ];

        return (
            <div className="bg-gray-100 py-12">
                <div className="max-w-screen-xl mx-auto text-center">
                    <h2 className="text-3xl font-semibold mb-8">What Users Say</h2>
                    <div className="flex flex-col md:flex-row justify-center items-center">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard key={index} {...testimonial} />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-screen h-screen mx-auto overflow-y-auto overflow-x-hidden bg-main">
            <Navbar />
            <div className="md:container md:mx-auto flex flex-col-reverse lg:flex-row items-center justify-between md:px-[20px] md:pt-[120px]">
                <div className=" text-center lg:text-left space-y-5">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                        Empowering Education.
                        <br />
                        Connect and Learn.
                    </h1>
                    <p className="text-greyish font-medium text-lg">
                        More than just a platform. Tailored to your educational needs.
                    </p>
                    <button className="bg-primaryBlue hover:bg-lightBlue transition-colors px-4 py-2 rounded-lg text-white font-normal" onClick={() => {
                        if (isLoggedIn !== undefined) {
                            if (isLoggedIn) push("/home")
                            else push("/login")
                        }
                    }}>Explore</button>


                </div>

                <div className="mt-5 md:mt-0 mb-5 ">
                    <img
                        className="lg:mr-20 w-[320px] h:[500px] md:w-[400px] md:[500px] lg:w-[500px] lg:h-auto"
                        src="/hero.png"
                        alt="notion-image"
                    />
                </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight ml-12">
                Our features
            </h1>
            <div className="mx-12 my-8 flex md:gap-4 lg:gap-6 flex-col items-center justify-between md:justify-between md:flex-row">
                <div className="flex flex-col cursor-pointer w-full md:w-1/3 mt-6 md:mt-0 mr-3 h-72 hover:scale-105 hover:shadow-2xl p-3 rounded-xl shadow-lg bg-white">
                    <img
                        className="h-32 mx-auto"
                        src="/find-job.png"
                        alt="jobs-icon"
                    />
                    <h3 className="font-semibold text-3xl md:text-xl lg:text-2xl my-auto text-center">
                        Find your dream job
                    </h3>
                    <p className="text-gray-600 mt-auto text-center ">
                        Search and apply for jobs in your field of interest.
                    </p>
                    <button onClick={() => {
                        if (isLoggedIn !== undefined) {
                            if (isLoggedIn) push("/home/jobs")
                            else push("/jobs")
                        }
                    }} className='bg-primaryBlue mt-3 w-24 ml-auto text-white h-10 rounded-lg hover:bg-lightBlue'>Find Jobs</button>
                </div>

                <div className="flex flex-col cursor-pointer w-full md:w-1/3 mt-6 md:mt-0 mr-3 h-72 hover:scale-105 hover:shadow-2xl p-3 rounded-xl shadow-lg bg-white">
                    <img
                        className="h-32 mx-auto"
                        src="/classroom-management.png"
                        alt="classrooms-icon"
                    />
                    <h3 className="font-semibold text-3xl md:text-xl lg:text-2xl my-auto text-center">
                        Classroom Management
                    </h3>
                    <p className="text-gray-600 mt-auto text-center ">
                        Create, manage, and collaborate in virtual classrooms.
                    </p>
                </div>

                <div className="flex flex-col cursor-pointer w-full md:w-1/3 mt-6 md:mt-0 p-3 h-72 hover:scale-105 hover:shadow-2xl rounded-xl shadow-lg bg-white">
                    <img
                        className="h-32 mx-auto"
                        src="/courses-recommendation.png"
                        alt="courses-icon"
                    />
                    <h3 className="font-semibold text-3xl md:text-xl lg:text-2xl my-auto text-center">
                        Course Recommendations
                    </h3>
                    <p className="text-gray-600 mt-auto text-center ">
                        Discover and learn courses related to your interests.
                    </p>
                </div>
            </div>

            <TestimonialsSection />
            <div className="bg-lightBlue text-main py-8 px-4">
                <div className="max-w-screen-xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
                    <p className="text-lg mb-4">
                        If you have any questions or need assistance, feel free to reach out to us.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4 ">
                        <div className="flex items-center">
                            <MdEmail className="font-lg" />
                            <p className="ml-2 underline font-semibold cursor-pointer hover:mainHover" onClick={handleEmailClick}>officialsatstudentguide@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default page