const DateSeparator = ({ label }) => {
  return (
    <div className="flex items-center justify-center my-4 lg:my-6">
      <div className="bg-gray-200 text-gray-500 px-2 lg:px-3 py-1 rounded-full text-xs font-medium">
        {label}
      </div>
    </div>
  );
};

export default DateSeparator;


