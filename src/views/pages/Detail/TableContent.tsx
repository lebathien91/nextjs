import { useEffect, useRef, useState } from "react";

interface TableContentProps {
  headings: any[];
}

const TableContent = ({ headings }: TableContentProps) => {
  const [activeId, setActiveId] = useState<any>();
  const getNestedHeadings = (headingElements: any[]) => {
    const nestedHeadings: any[] = [];

    headingElements.forEach((heading) => {
      const id = heading.id;
      const title = heading.rawText.trim();

      if (heading.tagName === "H2") {
        nestedHeadings.push({ id, title, items: [] });
      } else if (heading.tagName === "H3" && nestedHeadings.length > 0) {
        nestedHeadings[nestedHeadings.length - 1].items.push({
          id,
          title,
        });
      }
    });

    return nestedHeadings;
  };

  const useHeadingsData = () => {
    const [nestedHeadings, setNestedHeadings] = useState<any[]>([]);

    useEffect(() => {
      const headingElements = headings;

      const newNestedHeadings = getNestedHeadings(headingElements);
      setNestedHeadings(newNestedHeadings);
    }, []);
    return { nestedHeadings };
  };
  const { nestedHeadings } = useHeadingsData();

  const useIntersectionObserver = (setActiveId: Function) => {
    const headingElementsRef = useRef({});
    useEffect(() => {
      const callback = (headings: any[]) => {
        headingElementsRef.current = headings.reduce((map, headingElement) => {
          map[headingElement.target.id] = headingElement;
          return map;
        }, headingElementsRef.current);

        const visibleHeadings: any[] = [];
        Object.keys(headingElementsRef.current).forEach((key) => {
          const headingElementsRefCurrent = headingElementsRef.current as any;
          const headingElement = headingElementsRefCurrent[key];
          if (headingElement.isIntersecting)
            visibleHeadings.push(headingElement);
        });

        const getIndexFromId = (id: string) =>
          headingElements.findIndex((heading) => heading.id === id);

        if (visibleHeadings.length === 1) {
          setActiveId(visibleHeadings[0].target.id);
        } else if (visibleHeadings.length > 1) {
          const sortedVisibleHeadings = visibleHeadings.sort((a: any, b: any) =>
            getIndexFromId(a.target.id) > getIndexFromId(b.target.id) ? 1 : -1
          );
          setActiveId(sortedVisibleHeadings[0].target.id);
        }
      };

      const observer = new IntersectionObserver(callback, {
        rootMargin: "-80px 0px -50% 0px",
      });

      const headingElements = Array.from(
        document.querySelectorAll(".single h2, .single h3")
      );

      headingElements.forEach((element) => observer.observe(element));

      return () => observer.disconnect();
    }, [setActiveId]);
  };

  useIntersectionObserver(setActiveId);
  return (
    <aside className="flex-[2_1_0%] hidden xl:block min-w-[280px">
      <nav className={`sticky top-12`}>
        <h2 className="py-4">Table Content</h2>
        <ol className="">
          {nestedHeadings.map((heading) => (
            <li key={heading.id} className="pt-1">
              <a
                href={`#${heading.id}`}
                className={`hover:underline ${
                  heading.id === activeId ? "font-bold" : ""
                }`}
              >
                {heading.id === activeId && <span className="icon"></span>}
                {heading.title}
              </a>
              {heading.items.length > 0 && (
                <ol className="ml-6">
                  {heading.items.map((child: any) => (
                    <li key={child.id} className="mb-1">
                      <a
                        href={`#${child.id}`}
                        className={`hover:underline ${
                          child.id === activeId ? "font-bold" : ""
                        }`}
                      >
                        {heading.id === activeId && (
                          <span className="icon"></span>
                        )}
                        {child.title}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
};

export default TableContent;
