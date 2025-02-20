import React from 'react';

const FAQ = () => {
  return (
    <section className="bg-pink-50 mx-auto lg:px-40 px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
      <p className="text-gray-700 mb-4">Here are some common questions and answers about our services.</p>
      <ul className="list-disc pl-5">
        <li className="mb-2">
          <strong>Question 1:</strong> What is your return policy?
          <br />
          Answer: You can return any item within 30 days of purchase.
        </li>
        <li className="mb-2">
          <strong>Question 2:</strong> Do you offer international shipping?
          <br />
          Answer: Yes, we ship to many countries worldwide.
        </li>
      </ul>
    </section>
  );
};

export default FAQ;
