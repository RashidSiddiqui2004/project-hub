
'use client';

import React from 'react';
import { Icon } from '@chakra-ui/react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';


const Footer = () => {
    return (
        <footer className='text-center p-4 md:p-6'>
            <p className='font-bold'>Project Hub</p>
            <p>{new Date().getFullYear()} All rights reserved. Made with ❤️ by Rashid </p>

            <div className="flex justify-center mt-4 space-x-4">
                <a href=" https://github.com/RashidSiddiqui2004" target="_blank" rel="noopener noreferrer">
                    <Icon as={FaGithub} boxSize={20} />
                </a>
                <a href="https://www.linkedin.com/in/rashid-siddiqui2004/" target="_blank" rel="noopener noreferrer">
                    <Icon as={FaLinkedin} boxSize={20} />
                </a>
                <a href="https://twitter.com/RashidSidd3319" target="_blank" rel="noopener noreferrer">
                    <Icon as={FaTwitter} boxSize={20} />
                </a>
                <a href="https://instagram.com/rashid_siddiqui2026" target="_blank" rel="noopener noreferrer">
                    <Icon as={FaInstagram} boxSize={20} />
                </a>
            </div>
        </footer>
    )
}

export default Footer