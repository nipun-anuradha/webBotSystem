interface ActivityCardProps {
    data: {
        title: string;
        totalcount: number;
        todayCount: number;
        value: string;
        color: string;
    }
}

const ActivityCard = ({ data }: ActivityCardProps) => {
    const hexToRgba = (hex: string, alpha: number) => { // Convert hex color to RGB
        // Convert hex color to RGB
        let r: number = 0, g: number = 0, b: number = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const rgbaColor = hexToRgba(data.color, 0.15); // Convert hex color to RGBA

    return (
        <div
            style={{ backgroundColor: rgbaColor, borderColor: data.color }}
            className="w-full sm:min-w-[200px] h-[200px] rounded-xl border p-2 sm:p-4 flex flex-col justify-between"
        >
            <h2 className="text-[#292929] font-bold text-[20px] capitalize">
                {data.title}
            </h2>

            <h2 className="text-[#292929] font-bold text-[48px]">
                {data.totalcount}
            </h2>

            <div className="flex flex-col">
                <p className="text-[#292929] font-medium text-[16px]">
                    Appoinments: <span className='font-bold'>{data.todayCount} </span>
                </p>
                <p className="text-[#292929] font-medium text-[16px]">
                    Value: <span className='font-bold'>{data.value} </span>
                </p>
            </div>
        </div>
    );
};

export default ActivityCard;
