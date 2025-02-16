function TimelineCircle({ label }: { label: string }) {

    return (

        <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold"> {label} </div>
        </div>
    );
}

export default TimelineCircle;