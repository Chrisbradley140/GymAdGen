import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CampaignFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  dateFrom?: Date;
  dateTo?: Date;
  onDateFromChange: (date?: Date) => void;
  onDateToChange: (date?: Date) => void;
  offerType: string;
  onOfferTypeChange: (value: string) => void;
  toneStyle: string;
  onToneStyleChange: (value: string) => void;
  onClearFilters: () => void;
}

const CampaignFilters = ({
  search,
  onSearchChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  offerType,
  onOfferTypeChange,
  toneStyle,
  onToneStyleChange,
  onClearFilters
}: CampaignFiltersProps) => {
  return (
    <div className="bg-card p-4 rounded-lg border space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Filter Campaigns</h3>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="w-4 h-4 mr-1" />
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <Input
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        {/* Date From */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !dateFrom && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "PPP") : "From date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={onDateFromChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Date To */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !dateTo && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "PPP") : "To date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={onDateToChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Offer Type */}
        <Select value={offerType} onValueChange={onOfferTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Offer Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Offer Types</SelectItem>
            <SelectItem value="Course">Course</SelectItem>
            <SelectItem value="Coaching">Coaching</SelectItem>
            <SelectItem value="Product">Product</SelectItem>
            <SelectItem value="Service">Service</SelectItem>
            <SelectItem value="Event">Event</SelectItem>
            <SelectItem value="Free Resource">Free Resource</SelectItem>
          </SelectContent>
        </Select>

        {/* Tone Style */}
        <Select value={toneStyle} onValueChange={onToneStyleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tone Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tone Styles</SelectItem>
            <SelectItem value="Professional & Authoritative">Professional & Authoritative</SelectItem>
            <SelectItem value="Friendly & Conversational">Friendly & Conversational</SelectItem>
            <SelectItem value="Bold & Direct">Bold & Direct</SelectItem>
            <SelectItem value="Humorous & Light">Humorous & Light</SelectItem>
            <SelectItem value="Inspiring & Motivational">Inspiring & Motivational</SelectItem>
            <SelectItem value="Empathetic & Supportive">Empathetic & Supportive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CampaignFilters;