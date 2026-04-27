import React from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
// import { TbChevronDown } from '@heroicons/react/20/solid'
import { TbChevronDown } from 'react-icons/tb'

const DisclosureComponent = () => {
    return (
      <div className="h-auto w-full">
        <div className="w-full grid md:grid-cols-3 gap-8 justify-start md:justify-center divide-white/5 rounded-xl bg-white/5">
          <Disclosure as="div" className="p-6">
            <DisclosureButton className="group flex w-full items-center justify-between cursor-pointer">
              <span className="text-[16px]  text-leftfont-medium text-[#191C1F] group-data-hover:text-[#FA8232]">
                How do I return my item?
              </span>
              <TbChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="text-[14px] text-[#191C1F]" style={{marginTop: '5px'}}>
              If you're unhappy with your purchase, we'll refund you in full.
            </DisclosurePanel>
          </Disclosure>

          <Disclosure as="div" className="p-6">
            <DisclosureButton className="group flex w-full items-center justify-between cursor-pointer">
              <span className="text-[16px] text-left font-medium text-[#191C1F] group-data-hover:text-[#FA8232]">
                What are the 'Delivery Timelines'?
              </span>
              <TbChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="text-[14px] text-[#191C1F]" style={{marginTop: '5px'}}>
              If you're unhappy with your purchase, we'll refund you in full.
            </DisclosurePanel>
          </Disclosure>

          <Disclosure as="div" className="p-6">
            <DisclosureButton className="group flex w-full items-center justify-between cursor-pointer">
              <span className="text-[16px] text-left font-medium text-[#191C1F] group-data-hover:text-[#FA8232]">
                How to cancel Clicon Order.
              </span>
              <TbChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="text-[14px] text-[#191C1F]" style={{marginTop: '5px'}}>
              If you're unhappy with your purchase, we'll refund you in full.
            </DisclosurePanel>
          </Disclosure>

          <Disclosure as="div" className="p-6">
            <DisclosureButton className="group flex w-full items-center justify-between cursor-pointer">
              <span className="text-[16px] text-left font-medium text-[#191C1F] group-data-hover:text-[#FA8232]">
                What is Clicons Returns Policy?
              </span>
              <TbChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="text-[14px] text-[#191C1F]" style={{marginTop: '5px'}}>
              If you're unhappy with your purchase, we'll refund you in full.
            </DisclosurePanel>
          </Disclosure>

          <Disclosure as="div" className="p-6">
            <DisclosureButton className="group flex w-full items-center justify-between cursor-pointer">
              <span className="text-[16px] text-left font-medium text-[#191C1F] group-data-hover:text-[#FA8232]">
                What is 'Discover Your Daraz Campaign 2022'?
              </span>
              <TbChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="text-[14px] text-[#191C1F]" style={{marginTop: '5px'}}>
              If you're unhappy with your purchase, we'll refund you in full.
            </DisclosurePanel>
          </Disclosure>

          <Disclosure as="div" className="p-6">
            <DisclosureButton className="group flex w-full items-center justify-between cursor-pointer">
              <span className="text-[16px] text-left font-medium text-[#191C1F] group-data-hover:text-[#FA8232]">
                Ask the Digital and Device Community
              </span>
              <TbChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="text-[14px] text-[#191C1F]" style={{marginTop: '5px'}}>
              If you're unhappy with your purchase, we'll refund you in full.
            </DisclosurePanel>
          </Disclosure>

          <Disclosure as="div" className="p-6">
            <DisclosureButton className="group flex w-full items-center justify-between cursor-pointer">
              <span className="text-[16px] text-left font-medium text-[#191C1F] group-data-hover:text-[#FA8232]">
                How long is the refund process?
              </span>
              <TbChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="text-[14px] text-[#191C1F]" style={{marginTop: '5px'}}>
              If you're unhappy with your purchase, we'll refund you in full.
            </DisclosurePanel>
          </Disclosure>

          <Disclosure as="div" className="p-6">
            <DisclosureButton className="group flex w-full items-center justify-between cursor-pointer">
              <span className="text-[16px] text-left font-medium text-[#191C1F] group-data-hover:text-[#FA8232]">
                What is the Voucher & Gift Offer in this Campaign?
              </span>
              <TbChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="text-[14px] text-[#191C1F]" style={{marginTop: '5px'}}>
              If you're unhappy with your purchase, we'll refund you in full.
            </DisclosurePanel>
          </Disclosure>

          <Disclosure as="div" className="p-6">
            <DisclosureButton className="group flex w-full items-center justify-between cursor-pointer">
              <span className="text-[16px] text-left font-medium text-[#191C1F] group-data-hover:text-[#FA8232]">
                How to change my shop name?
              </span>
              <TbChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="text-[14px] text-[#191C1F]" style={{marginTop: '5px'}}>
              If you're unhappy with your purchase, we'll refund you in full.
            </DisclosurePanel>
          </Disclosure>

         
        </div>
      </div>
    )
}

export default DisclosureComponent

