'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';

import { useStateContext } from '../../../context';
import { CustomButton, FormField, Loader } from '../../../components';
import { checkIfImage } from '../../../utils';

export default function CreateCampaign() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: '',
    category: '',
    website: '',
    twitter: '',
    linkedin: '',
    documentLink: '',
  });

  const { createCampaign, getCategories } = useStateContext();
  const [categories, setCategories] = useState([]);

  // Compute today's date in YYYY-MM-DD to set as the min for the date picker
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    getCategories().then(setCategories);
  }, [getCategories]);

  const handleFormFieldChange = (field, e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Validate image URL
    const isValidImage = await new Promise(resolve =>
      checkIfImage(form.image, resolve)
    );
    if (!isValidImage) {
      alert('Campaign image URL is invalid');
      setForm(f => ({ ...f, image: '' }));
      return;
    }

    // 2) Ensure required fields
    const required = ['title','description','target','deadline','image','category'];
    for (const key of required) {
      if (!form[key]) {
        alert(`Please fill in the ${key} field.`);
        return;
      }
    }

    setIsLoading(true);
    try {
      // 3) Create on‑chain, passing optional links (empty string if omitted)
      const campaignId = await createCampaign({
        ...form,
        target: ethers.utils.parseUnits(form.target, 18),
      });

      console.log('New campaign ID:', campaignId);
      router.push('/');
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#2C2F33] flex flex-col items-center rounded-lg shadow-lg p-8">
      {isLoading && <Loader />}

      <h1 className="text-3xl font-bold text-white mb-6">Launch Your Campaign</h1>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/* — REQUIRED FIELDS — */}
        <FormField
          labelName="Campaign Name *"
          placeholder="Campaign for a cause"
          inputType="text"
          value={form.title}
          handleChange={e => handleFormFieldChange('title', e)}
          required
        />

        <FormField
          labelName="Description *"
          placeholder="Tell us your story"
          isTextArea
          value={form.description}
          handleChange={e => handleFormFieldChange('description', e)}
          required
        />

        <div className="flex gap-4">
          <FormField
            labelName="Funding Goal (ETH) *"
            placeholder="e.g., 0.75"
            inputType="number"
            value={form.target}
            handleChange={e => handleFormFieldChange('target', e)}
            required
          />
          <FormField
            labelName="End Date *"
            placeholder="Select a date"
            inputType="date"
            value={form.deadline}
            handleChange={e => handleFormFieldChange('deadline', e)}
            required
            min={today}
          />
        </div>

        <FormField
          labelName="Image URL *"
          placeholder="https://your-image-url.com"
          inputType="url"
          value={form.image}
          handleChange={e => handleFormFieldChange('image', e)}
          required
        />

        <label className="text-lg font-medium text-white">Category *</label>
        <select
          value={form.category}
          onChange={e => handleFormFieldChange('category', e)}
          className="bg-[#40444B] p-2 rounded-lg text-white"
          required
        >
          <option value="">Choose a category</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        {/* — OPTIONAL SOCIAL & DOC LINKS — */}
        <FormField
          labelName="Website URL"
          placeholder="https://your-site.com"
          inputType="url"
          value={form.website}
          handleChange={e => handleFormFieldChange('website', e)}
        />
        <FormField
          labelName="Twitter URL"
          placeholder="https://twitter.com/..."
          inputType="url"
          value={form.twitter}
          handleChange={e => handleFormFieldChange('twitter', e)}
        />
        <FormField
          labelName="LinkedIn URL"
          placeholder="https://linkedin.com/in/..."
          inputType="url"
          value={form.linkedin}
          handleChange={e => handleFormFieldChange('linkedin', e)}
        />
        <FormField
          labelName="Document Link (PDF)"
          placeholder="https://example.com/doc.pdf"
          inputType="url"
          value={form.documentLink}
          handleChange={e => handleFormFieldChange('documentLink', e)}
        />

        <div className="flex justify-center mt-6">
          <CustomButton
            btnType="submit"
            title="Create Campaign"
            styles="bg-[#7289DA] hover:bg-[#5B6EAE] transition duration-300"
          />
        </div>
      </form>
    </div>
  );
}
