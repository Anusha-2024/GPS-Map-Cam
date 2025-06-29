import React from 'react';
import { Mail, MessageCircle, Github, ExternalLink } from 'lucide-react';

const Contact: React.FC = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help with technical issues or feature requests',
      contact: 'krianusha09@gmail.com',
      action: 'mailto:krianusha09@gmail.com'
    },
    {
      icon: MessageCircle,
      title: 'Feedback',
      description: 'Share your thoughts and suggestions for improvement',
      contact: 'feedback@gpsmapCamera.com',
      action: 'mailto:feedback@gpsmapCamera.com'
    },
    {
      icon: Github,
      title: 'Open Source',
      description: 'View source code and contribute to the project',
      contact: 'anusha 2024',
      action: 'https://github.com/anusha2024'
    }
  ];

  const faqs = [
    {
      question: 'Is my photo data secure?',
      answer: 'Yes, all processing happens locally in your browser. No photos are uploaded to any server, ensuring complete privacy.'
    },
    {
      question: 'What image formats are supported?',
      answer: 'We support JPG, JPEG, and PNG formats. The output will maintain the original format and quality.'
    },
    {
      question: 'Can I use this on mobile devices?',
      answer: 'Absolutely! GPS Map Camera is fully responsive and works great on smartphones and tablets.'
    },
    {
      question: 'How accurate are the GPS coordinates?',
      answer: 'The coordinates are as accurate as the map service (typically within a few meters) and can be manually fine-tuned.'
    },
    {
      question: 'Can I customize the watermark appearance?',
      answer: 'Yes, you can adjust position, font size, opacity, colors, and background to match your needs.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Get in Touch
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions, suggestions, or need help? We'd love to hear from you.
          Choose the best way to reach out below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <a
              key={index}
              href={method.action}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {method.description}
                </p>
                <div className="flex items-center justify-center space-x-1 text-blue-600 font-medium">
                  <span>{method.contact}</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.question}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Want to contribute?
          </h3>
          <p className="text-gray-600 mb-4">
            GPS Map Camera is open source and welcomes contributions from the community.
          </p>
          <a
            href="#"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Github className="w-5 h-5" />
            <span>View on GitHub</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;