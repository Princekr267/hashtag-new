"use client";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import { Link } from "react-router-dom";

export default function ThreeDCardDemo(props: any) {

  const { image, header, desc, readTime, id } = props;
  console.log("Image: ", image)
  console.log("Header: ", header)
  console.log("Desc: ", desc)
  console.log("readTime: ", readTime)

  return (
    <div className="relative">

      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-[#60a5fa]/[0.15] dark:bg-[#070c18] dark:border-white/[0.06] dark:hover:border-[#60a5fa]/30 border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border transition-all duration-300">
          {/* Ambient Glowing Blurred Orbs Matching Site Palette */}
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-[#60a5fa]/20 rounded-full blur-[70px] group-hover/card:bg-[#60a5fa]/30 transition-all duration-700" />
            <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-[#818cf8]/20 rounded-full blur-[70px] group-hover/card:bg-[#818cf8]/30 transition-all duration-700" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#38bdf8]/15 rounded-full blur-[60px] group-hover/card:bg-[#38bdf8]/25 transition-all duration-700" />
          </div>
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            {id ? <Link to={`/blogs/${id}`} className="hover:underline">{header}</Link> : header}
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            {desc}
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            {id ? (
              <Link to={`/blogs/${id}`}>
                <img
                  src={`${image}`}
                  height="1000"
                  width="1000"
                  className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                  alt="thumbnail"
                />
              </Link>
            ) : (
              <img
                src={`${image}`}
                height="1000"
                width="1000"
                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail"
              />
            )}
          </CardItem>
          <div className="flex justify-between items-center mt-20">
            <CardItem
              translateZ={20}
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
            >
              {readTime}
            </CardItem>
            {id ? (
              <CardItem
                translateZ={20}
                as={Link}
                to={`/blogs/${id}`}
                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold inline-block"
              >
                {"Read Story ->"}
              </CardItem>
            ) : (
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
              >
                {"Read Story ->"}
              </CardItem>
            )}
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
}
