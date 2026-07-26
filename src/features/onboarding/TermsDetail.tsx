import OnboardingHeaderBar from './ui/OnboardingHeaderBar';
import { TERMS_CONTENT } from './termsContent';
import type { TermKey } from './termsContent';

interface TermsDetailProps {
  termKey: TermKey;
  onClose: () => void;
}

const TermsDetail = ({ termKey, onClose }: TermsDetailProps) => {
  const content = TERMS_CONTENT[termKey];

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-md flex-col bg-white">
      <OnboardingHeaderBar title={content.title} onBack={onClose} />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-10">
        {content.intro && (
          <p className="mb-6 text-base font-medium leading-7 text-gray-800">{content.intro}</p>
        )}

        {/* 조항형 (서비스 이용 약관) */}
        {content.articles?.map((article) => (
          <section key={article.heading} className="mb-6">
            <h2 className="mb-2 text-lg font-bold text-gray-900">{article.heading}</h2>
            {article.paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-1.5 text-base font-medium leading-7 text-gray-800">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {/* 표형 (개인정보/민감정보/위치정보 동의) */}
        {content.table && (
          <table className="w-full table-fixed border-collapse overflow-hidden rounded-xl border-[3px] border-gray-200 text-base">
            <thead>
              <tr className="bg-brand-50">
                {content.table.columns.map((column) => (
                  <th
                    key={column}
                    className="border-[3px] border-gray-200 px-2 py-3 text-center font-bold text-gray-900"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.table.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border-[3px] border-gray-200 px-2 py-3 text-center font-medium leading-7 text-gray-800"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 안내 문구 */}
        {content.notes && (
          <ul className="mt-4 space-y-1.5">
            {content.notes.map((note, index) => (
              <li key={index} className="flex gap-1 text-sm leading-6 text-gray-500">
                <span aria-hidden>※</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TermsDetail;
