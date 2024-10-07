import React from "react";

const OkibroEyeMobile = () => {
  return (
    <svg
      id="organic-blob"
      width="300"
      height="300"
      xmlns="http://www.w3.org/2000/svg"
      filter="url(#goo)"
      fill="#e982cc"
    >
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
      <g>
        <circle r="135" cy="145" cx="150">
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 145 150"
            to="360 145 150"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="135" cy="155" cx="150">
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="360 155 150"
            to="0 155 150"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="135" cy="150" cx="145">
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 150 145"
            to="360 150 145"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="135" cy="150" cx="155">
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="360 150 155"
            to="0 150 155"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
};

export default OkibroEyeMobile;
