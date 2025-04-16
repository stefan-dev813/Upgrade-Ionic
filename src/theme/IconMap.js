const React = require('react');
const {createElement} = React;

const IconButton = require('material-ui/IconButton').default;

const AddIcon = require('material-ui/svg-icons/content/add').default;
const AirplaneModeActiveIcon = require('material-ui/svg-icons/device/airplanemode-active').default;
const ArrowBackIcon = require('material-ui/svg-icons/navigation/arrow-back').default;
const ArrowDropDownCircleIcon = require('material-ui/svg-icons/navigation/arrow-drop-down-circle').default;
const ArrowDropDownIcon = require('material-ui/svg-icons/navigation/arrow-drop-down').default;
const ArrowForwardIcon = require('material-ui/svg-icons/navigation/arrow-forward').default;
const AssignmentIcon = require('material-ui/svg-icons/action/assignment-ind').default;
const AttachMoneyIcon = require('material-ui/svg-icons/editor/attach-money').default;
const BusinessIcon = require('material-ui/svg-icons/communication/business').default;
const CardTravelIcon = require('material-ui/svg-icons/action/card-travel').default;
const CheckIcon = require('material-ui/svg-icons/navigation/check').default;
const ChevronLeftIcon = require('material-ui/svg-icons/navigation/chevron-left').default;
const ChevronRightIcon = require('material-ui/svg-icons/navigation/chevron-right').default;
const ContactsIcon = require('material-ui/svg-icons/communication/contacts').default;
const ContentCopyIcon = require('material-ui/svg-icons/content/content-copy').default;
const CreateIcon = require('material-ui/svg-icons/content/create').default;
const DashboardIcon = require('material-ui/svg-icons/action/dashboard').default;
const DateRangeIcon = require('material-ui/svg-icons/action/date-range').default;
const DeleteIcon = require('material-ui/svg-icons/action/delete').default;
const DetailsIcon = require('material-ui/svg-icons/image/details').default;
const DirectionsCarIcon = require('material-ui/svg-icons/maps/directions-car').default;
const EditIcon = require('material-ui/svg-icons/image/edit').default;
const EmailIcon = require('material-ui/svg-icons/communication/email').default;
const ErrorIcon = require('material-ui/svg-icons/alert/error').default;
const EventNoteIcon = require('material-ui/svg-icons/notification/event-note').default;
const ExpandLessIcon = require('material-ui/svg-icons/navigation/expand-less').default;
const ExpandMoreIcon = require('material-ui/svg-icons/navigation/expand-more').default;
const FlightIcon = require('material-ui/svg-icons/maps/flight').default;
const FolderIcon = require('material-ui/svg-icons/file/folder').default;
const FormatQuoteIcon = require('material-ui/svg-icons/editor/format-quote').default;
const GroupIcon = require('material-ui/svg-icons/social/group').default;
const HotelIcon = require('material-ui/svg-icons/maps/hotel').default;
const InfoIcon = require('material-ui/svg-icons/action/info').default;
const InfoOutlineIcon = require('material-ui/svg-icons/action/info-outline').default;
const LanguageIcon = require('material-ui/svg-icons/action/language').default;
const LibraryBooksIcon = require('material-ui/svg-icons/av/library-books').default;
const LinkIcon = require('material-ui/svg-icons/content/link').default;
const LocationOnIcon = require('material-ui/svg-icons/communication/location-on').default;
const LocalOfferIcon = require('material-ui/svg-icons/maps/local-offer').default;
const LockIcon = require('material-ui/svg-icons/action/lock').default;
const MenuIcon = require('material-ui/svg-icons/navigation/menu').default;
const MessageIcon = require('material-ui/svg-icons/communication/message').default;
const MoreHorizIcon = require('material-ui/svg-icons/navigation/more-horiz').default;
const MoreVertIcon = require('material-ui/svg-icons/navigation/more-vert').default;
const MyLocationIcon = require('material-ui/svg-icons/maps/my-location').default;
const PermContactCalendarIcon = require('material-ui/svg-icons/action/perm-contact-calendar').default;
const PersonIcon = require('material-ui/svg-icons/social/person').default;
const PersonAddIcon = require('material-ui/svg-icons/social/person-add').default;
const PhoneIcon = require('material-ui/svg-icons/communication/phone').default;
const PlaylistAddCheckIcon = require('material-ui/svg-icons/av/playlist-add-check').default;
const SaveIcon = require('material-ui/svg-icons/content/save').default;
const SearchIcon = require('material-ui/svg-icons/action/search').default;
const SendIcon = require('material-ui/svg-icons/content/send').default;
const SettingsIcon = require('material-ui/svg-icons/action/settings').default;
const SmartPhoneIcon = require('material-ui/svg-icons/hardware/smartphone').default;
const SpeakerNotesIcon = require('material-ui/svg-icons/action/speaker-notes').default;
const TodayIcon = require('material-ui/svg-icons/action/today').default;
const TextFieldsIcon = require('material-ui/svg-icons/editor/text-fields').default;
const ThumbUpIcon = require('material-ui/svg-icons/action/thumb-up').default;
const UndoIcon = require('material-ui/svg-icons/content/undo').default;
const VideoCamIcon = require('material-ui/svg-icons/av/videocam').default;
const WarningIcon = require('material-ui/svg-icons/alert/warning').default;
const WorkIcon = require('material-ui/svg-icons/action/work').default;

// settings-ethernet
// graphic-eq
// linear-scale
// more-horiz

const map = {
  'add': AddIcon,
  'airplanemode-active': AirplaneModeActiveIcon,
  'arrow-back': ArrowBackIcon,
  'arrow-drop-down-circle': ArrowDropDownCircleIcon,
  'arrow-drop-down': ArrowDropDownIcon,
  'arrow-forward': ArrowForwardIcon,
  'assignment': AssignmentIcon,
  'attach-money': AttachMoneyIcon,
  'business': BusinessIcon,
  'card-travel': CardTravelIcon,
  'check': CheckIcon,
  'chevron-left': ChevronLeftIcon,
  'chevron-right': ChevronRightIcon,
  'contacts': ContactsIcon,
  'content-copy': ContentCopyIcon,
  'create': CreateIcon,
  'dashboard': DashboardIcon,
  'date-range': DateRangeIcon,
  'delete': DeleteIcon,
  'details': DetailsIcon,
  'directions-car': DirectionsCarIcon,
  'edit': EditIcon,
  'email': EmailIcon,
  'error': ErrorIcon,
  'event-note': EventNoteIcon,
  'expand-less': ExpandLessIcon,
  'expand-more': ExpandMoreIcon,
  'folder': FolderIcon,
  'format-quote': FormatQuoteIcon,
  'flight': FlightIcon,
  'ground': DirectionsCarIcon,
  'group': GroupIcon,
  'hotel': HotelIcon,
  'info': InfoIcon,
  'info-outline': InfoOutlineIcon,
  'language': LanguageIcon,
  'library-books': LibraryBooksIcon,
  'link': LinkIcon,
  'location-on': LocationOnIcon,
  'local-offer': LocalOfferIcon,
  'lock': LockIcon,
  'menu': MenuIcon,
  'message': MessageIcon,
  'more-horiz': MoreHorizIcon,
  'more-vert': MoreVertIcon,
  'my-location': MyLocationIcon,
  'perm-contact-calendar': PermContactCalendarIcon,
  'person': PersonIcon,
  'person-add': PersonAddIcon,
  'phone': PhoneIcon,
  'playlist-add-check': PlaylistAddCheckIcon,
  'save': SaveIcon,
  'search': SearchIcon,
  'send': SendIcon,
  'settings': SettingsIcon,
  'smartphone': SmartPhoneIcon,
  'speaker-notes': SpeakerNotesIcon,
  'today': TodayIcon,
  'text-fields': TextFieldsIcon,
  'thumb-up': ThumbUpIcon,
  'undo': UndoIcon,
  'videocam': VideoCamIcon,
  'warning': WarningIcon,
  'work': WorkIcon
};

const getIcon = (key) => {
  return map[key];
}

const getElement = (key, props) => {
  const icon = getIcon(key);

  if (!icon)
    return null;

  return createElement(icon, props);
}

const getButton = (key, btnProps, elProps) => {
  return <IconButton {...btnProps}>{getElement(key, elProps)}</IconButton>;
}

const getFormIcon = (key) => {
  return <IconButton style={{
    top: '12px',
    padding: '12px 0px',
    margin: '12px 0px'
  }}>{getElement(key)}</IconButton>;
}

// export {
//   map,
//   getIcon(key) {
//     return map[key];
//   },
//   getElement(key, props) {
//     const icon = this.getIcon(key);
//
//     if (!icon)
//       return null;
//
//     return createElement(icon, props);
//   },
//   getButton(key, btnProps, elProps) {
//     return <IconButton {...btnProps}>{this.getElement(key, elProps)}</IconButton>;
//   },
//   getFormIcon(key) {
//     return <IconButton style={{
//       top: '12px',
//       padding: '12px 0px',
//       margin: '12px 0px'
//     }}>{this.getElement(key)}</IconButton>;
//   }
// };

export {
  map,
  getIcon,
  getElement,
  getButton,
  getFormIcon
};