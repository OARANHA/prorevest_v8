import React from 'react';
import { Button } from './ui/button';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const socialLinks = [
  { name: "fb", category: "social" },
  { name: "pi", category: "social" },
  { name: "in", category: "social" },
];

const categoryLinks = [
  { name: "manufacturing", category: "category" },
  { name: "packaging", category: "category" },
  { name: "team", category: "category" },
];

export function HeroSection() {
  return (
    <div className="absolute top-0 left-0 w-full h-[700px] bg-[url(/images/banner.png)] bg-cover bg-[100%_100%] z-0">
      {/* Barra lateral com links sociais e categorias */}
      <div className="absolute w-[78px] h-[670px] top-[100px] left-0">
        <div className="absolute w-[78px] h-48 top-[478px] left-0 bg-[#ffffff66] backdrop-blur-[22px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(22px)_brightness(100%)]">
          <div className="relative top-[86px] left-[-13px] inline-flex items-start gap-8 rotate-[-90.00deg]">
            {socialLinks.map((link, index) => (
              <div
                key={index}
                className="relative w-fit mt-[-1.00px] font-circular-std font-medium text-black text-sm tracking-[0] leading-[normal]"
              >
                {link.name}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-[111px] left-[-82px] inline-flex items-start gap-8 rotate-[-90.00deg]">
          {categoryLinks.map((link, index) => (
            <div
              key={index}
              className="relative w-fit mt-[-1.00px] font-baloo-tamma font-normal text-[#eb5937] text-sm tracking-[0] leading-[normal]"
              >
              {link.name}
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo principal do hero */}
      <div className="absolute w-[554px] h-[405px] top-[180px] left-[172px]">
        <div className="absolute w-[445px] top-[182px] left-0 font-baloo-tamma font-normal text-black text-lg tracking-[0] leading-7">
          From they fine john he give of rich he. They age and draw mrs
          like. Improving end distrusts may instantly was household
          applauded incommode.
        </div>

        <div className="absolute w-[200px] h-[67px] top-[338px] left-[18px]">
          <Button className="relative w-[198px] h-[67px] bg-[#eb5937] rounded-lg border-[0.1px] border-solid border-black hover:bg-[#d14a2e] h-auto">
            <div className="font-baloo-tamma font-normal text-white text-4xl tracking-[0] leading-7 whitespace-nowrap">
              Studio
            </div>
          </Button>
        </div>

        <div className="absolute w-[554px] h-[172px] top-0 left-0">
          <div className="relative w-[552px] h-[172px]">
            <div className="absolute top-0 left-0 font-google-sans font-medium text-[#444444] text-base tracking-[0.96px] leading-7 whitespace-nowrap">
              REIMAGINE THE LIVING STANDARDS WITH AR SHAKIR
            </div>

            <div className="absolute w-[545px] h-[156px] top-4 left-[7px]">
              <div className="absolute w-[452px] h-[131px] top-[25px] left-0 bg-gradient-to-r from-orange-200 to-red-200 rounded-xl"></div>
              <div className="absolute w-[103px] h-[136px] top-0 left-[442px] bg-gradient-to-b from-yellow-200 to-orange-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de watch lookbook */}
      <div className="absolute w-[215px] h-[31px] top-[650px] left-[172px]">
        <Button
          variant="ghost"
          className="flex items-center gap-4 p-0 h-auto hover:bg-transparent"
        >
          <div className="w-[30px] h-[30px] bg-[#444444] rounded-[15px] flex items-center justify-center">
            <Play className="w-2.5 h-[11px] text-white fill-white" />
          </div>
          <div className="font-google-sans font-medium text-[#444444] text-base tracking-[0.96px] leading-7 whitespace-nowrap">
            WATCH LOOKBOOK
          </div>
        </Button>
      </div>
    </div>
  );
}
