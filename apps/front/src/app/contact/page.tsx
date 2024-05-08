import ContactForm from '@/components/contact-form'
import { xiorInstance } from '@/utils/xiorInstance'

export default function Contact() {
    async function handleSubmit(
        data: FormData
    ): Promise<{ state: false; message: string } | { state: true }> {
        'use server'

        try {
            await xiorInstance.post('/contact', data)
            return {
                state: true,
            }
        } catch (e: any) {
            return {
                state: false,
                message:
                    e?.response?.data?.message || 'Une erreur est survenue',
            }
        }
    }
    return <ContactForm onSubmit={handleSubmit} />
}
