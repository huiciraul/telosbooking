"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

interface FaqSectionProps {
  title?: string
  items: FaqItem[]
  className?: string
}

export function FaqSection({ title = "Preguntas Frecuentes", items, className }: FaqSectionProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className={`py-8 md:py-12 ${className}`}>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <HelpCircle className="w-10 h-10 mx-auto text-purple-600 mb-2" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger className="text-left hover:no-underline text-base md:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-sm md:text-base leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
