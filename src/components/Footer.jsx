import React from 'react'
import { Link } from 'react-router-dom'
import { footerLinks } from '../constants'

const Footer = () => {
  return (
    <footer className='py-5 sm:px-10 px-5'>
        <div className='screen-max-width'>
            <div>
                <p className='font-semibold text-gray text-xs'>More ways to shop : {' '}
                    <span className='text-apple-blue'>
                        Find an Apple Store {' '}
                    </span>
                    or {' '}
                    <span className='text-apple-blue'>
                        other retailer
                    </span>{' '}
                    near you.
                </p>
                <p className='font-semibold text-gray text-xs'>More ways to shop : {' '}
                    Or call 00000-040-1966
                </p>
            </div>

            <div className='bg-neutral-700 my-5 h-px w-full' />
            <div className='flex md:flex-row flex-col md:items-center justify-between'>
                <p className='font-semibold text-gray text-xs'>Copyright @ 2026 CodesOfAkash. All rights reserved.
                </p>
                <div className='flex'>
                    {footerLinks.map((link, i) => (
                        <React.Fragment key={link.text}>
                            <Link to={link.link} className='font-semibold text-gray text-xs hover:text-white transition-colors'>
                                {link.text}
                            </Link>
                            {i !== footerLinks.length - 1 && <span className='mx-2 font-semibold text-gray text-xs'> | </span>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
