'use client'

import Loader from '@/components/Loader/index'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { xiorInstance } from '@/utils/xiorInstance'
import { useQuery } from '@tanstack/react-query'

type Faq = {
    question: string
    answer: string
}

export default function Faq() {
    const { data, error, isFetched } = useQuery({
        queryFn: async () => {
            const { data } = await xiorInstance.get<Faq[]>('/faqs')
            return data
        },
        queryKey: ['faqs'],
    })

    if (!isFetched) {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <Loader />
            </div>
        )
    }

    return (
        <div className="mb-16 mt-4">
            <div className="flex items-center justify-center">
                <h1 className="text-xl">QUESTIONS FRÉQUENTES</h1>
            </div>
            <div className="flex items-center justify-center mt-8">
                <div className="px-4 w-full mx-8 md:mx-0 md:w-[500px] lg:w-[700px] xl:w-[80%]">
                    <Accordion type="single" collapsible className="w-full">
                        {
                            data?.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                >
                                    <AccordionTrigger>
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {
                                            <div className="flex flex-col gap-8 mb-8">
                                                <Separator />
                                                <span>{faq.answer}</span>
                                            </div>
                                        }
                                    </AccordionContent>
                                </AccordionItem>
                            ))!
                        }
                    </Accordion>
                </div>
            </div>
        </div>
    )
}
