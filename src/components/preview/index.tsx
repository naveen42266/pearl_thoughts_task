import { useDatePickerStore } from "@/stores/useDatePickerStore";
import CustomDateCalendar from "./customizedPicker";

const PerviewComponent = () => {
    const { futureDates } = useDatePickerStore();
    return <div className="">
        <h3 className="text-lg font-semibold mb-4 md:pl-5">Preview</h3>
        <CustomDateCalendar dates={futureDates} />
    </div>
}
export default PerviewComponent;