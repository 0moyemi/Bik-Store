import Marketplace from './index'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Shop Islamic Fashion',
    description: 'Browse our collection of quality abayas, jalabiyas, hijabs, caps and prayer mats. Premium Islamic modest fashion in Ibadan, Nigeria.',
    alternates: {
        canonical: '/marketplace',
    },
}

const page = () => {
    return <Marketplace />
}

export default page
