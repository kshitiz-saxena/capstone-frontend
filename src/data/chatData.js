export const quickPrompts = [
  'What is the tariff for shipping an iPhone from the US to India?',
  'Can you explain the customs duty on imported handbags?',
  'Review my customs notice for the latest tax impact.',
]

export const initialMessages = [
  {
    id: 1,
    sender: 'bot',
    text:
      'Hello! I can help you estimate duties, explain HS code implications, and review customs notices. Ask me about a product, shipping route, or uploaded customs document.',
  },
  {
    id: 2,
    sender: 'bot',
    text:
      'Try asking: “What would be the tariff if I ship an iPhone from the US to India?”',
  },
]

export function generateBotReply(userText = '') {
  const normalizedText = userText.toLowerCase()

  if (normalizedText.includes('iphone') || normalizedText.includes('phone')) {
    return 'For an iPhone imported from the US to India, the effective cost may include basic customs duty, GST, and any applicable social welfare surcharge. A rough estimate would depend on the product category, declared value, and HS code classification. I can help break this down for your exact shipment.'
  }

  if (normalizedText.includes('handbag') || normalizedText.includes('bag')) {
    return 'Luxury bags often attract a higher import duty depending on material, origin, and applicable trade policy. The total landed cost typically includes customs duty, GST, and other regulatory charges. Please share the brand, value, and declaration details for a more precise estimate.'
  }

  if (normalizedText.includes('notice') || normalizedText.includes('document') || normalizedText.includes('customs')) {
    return 'I can review customs notices and documents to spot tariff triggers, tax liabilities, and compliance notes. Please upload the notice or a photo/PDF of the document, and I will summarise the important points.'
  }

  return 'I can estimate tariff impact, explain customs duty, and interpret your documents. Share the product type, country of origin, destination, and declared value so I can give a more accurate answer.'
}
