import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Base icon props
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

// Create a base icon component
const createIcon = (Component: React.ComponentType<React.SVGProps<SVGSVGElement>>) => {
  return React.forwardRef<SVGSVGElement, IconProps>(
    ({ className, size = 24, ...props }, ref) => (
      <Component
        ref={ref}
        className={cn('h-5 w-5', className)}
        style={{
          width: size,
          height: size,
        }}
        {...props}
      />
    )
  );
};

// Lucide Icons
export const ArrowRight = createIcon(require('lucide-react').ArrowRight);
export const ChevronDown = createIcon(require('lucide-react').ChevronDown);
export const Brain = createIcon(require('lucide-react').Brain);
export const Users = createIcon(require('lucide-react').Users);
export const BookOpen = createIcon(require('lucide-react').BookOpen);
export const BarChart = createIcon(require('lucide-react').BarChart);
export const MessageSquare = createIcon(require('lucide-react').MessageSquare);
export const Bell = createIcon(require('lucide-react').Bell);
export const Home = createIcon(require('lucide-react').Home);
export const Book = createIcon(require('lucide-react').Book);
export const GraduationCap = createIcon(require('lucide-react').GraduationCap);
export const User = createIcon(require('lucide-react').User);
export const Settings = createIcon(require('lucide-react').Settings);
export const LogOut = createIcon(require('lucide-react').LogOut);
export const Menu = createIcon(require('lucide-react').Menu);
export const X = createIcon(require('lucide-react').X);
export const Search = createIcon(require('lucide-react').Search);
export const Plus = createIcon(require('lucide-react').Plus);
export const Check = createIcon(require('lucide-react').Check);
export const Loader2 = createIcon(require('lucide-react').Loader2);
export const FileText = createIcon(require('lucide-react').FileText);
export const FileUp = createIcon(require('lucide-react').FileUp);
export const Download = createIcon(require('lucide-react').Download);
export const Calendar = createIcon(require('lucide-react').Calendar);
export const Clock = createIcon(require('lucide-react').Clock);
export const AlertCircle = createIcon(require('lucide-react').AlertCircle);
export const CheckCircle = createIcon(require('lucide-react').CheckCircle);
export const Info = createIcon(require('lucide-react').Info);
export const AlertTriangle = createIcon(require('lucide-react').AlertTriangle);

// Social Icons
export const Google = createIcon(require('lucide-react').Github);
export const GitHub = createIcon(require('lucide-react').Github);
export const Microsoft = createIcon(require('lucide-react').Microsoft);

// Custom Icons
export const EduSphereLogo = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={cn("text-primary", props.className)}
  >
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8V16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 12H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Export all icons as a single object
export const Icons = {
  arrowRight: ArrowRight,
  chevronDown: ChevronDown,
  brain: Brain,
  users: Users,
  bookOpen: BookOpen,
  barChart: BarChart,
  messageSquare: MessageSquare,
  bell: Bell,
  home: Home,
  book: Book,
  graduationCap: GraduationCap,
  user: User,
  settings: Settings,
  logOut: LogOut,
  menu: Menu,
  x: X,
  search: Search,
  plus: Plus,
  check: Check,
  loader: Loader2,
  fileText: FileText,
  fileUp: FileUp,
  download: Download,
  calendar: Calendar,
  clock: Clock,
  alertCircle: AlertCircle,
  checkCircle: CheckCircle,
  info: Info,
  alertTriangle: AlertTriangle,
  google: Google,
  github: GitHub,
  microsoft: Microsoft,
  logo: EduSphereLogo,
};

// Icon component with variants
const iconVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive",
      success: "text-green-500",
      warning: "text-yellow-500",
      info: "text-blue-500",
    },
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      default: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
      "2xl": "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface IconComponentProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof iconVariants> {
  asChild?: boolean;
  name: keyof typeof Icons;
}

export const Icon = React.forwardRef<HTMLSpanElement, IconComponentProps>(
  ({ className, variant, size, name, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    const IconComponent = Icons[name] || Icons.info;

    return (
      <Comp
        className={cn(iconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <IconComponent className={cn(iconVariants({ variant, size, className }))} />
      </Comp>
    );
  }
);

Icon.displayName = "Icon";
