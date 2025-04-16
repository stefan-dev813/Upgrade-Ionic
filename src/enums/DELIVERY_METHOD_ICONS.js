import TranslateActionsFactory from "../actions/TranslateActions";

const {getText} = TranslateActionsFactory({});

const icons = {
	'on-site': {
		icon: 'group',
		label: getText('on-site')
	},
	'1': {
		icon: 'group',
		label: getText('on-site')
	},
	'video/web': {
		icon: 'videocam',
		label: getText('video/web')
	},
	'2': {
		icon: 'videocam',
		label: getText('video/web')
	},
	'phone': {
		icon: 'phone',
		label: getText('phone')
	},
	'3': {
		icon: 'phone',
		label: getText('phone')
	},
	'not set': {
		icon: 'none',
		label: getText('not set')
	},
	'0': {
		icon: 'none',
		label: getText('not set')
	}
};

export default icons;