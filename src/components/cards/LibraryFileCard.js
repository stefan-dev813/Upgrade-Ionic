/**
 * Creates and LibraryFileCard Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 * @mixes AutoShouldUpdateMixin
 * @mixes CardMixin
 */
const LibraryFileCardFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // Components
    const {ListCardFactory} = require('./ListCard');

    // Material UI
    const Avatar = require('material-ui/Avatar').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        CardMixinFactory
    } = require('../../mixins');

    // Utils
    const DateToolsFactory = require('../../util/DateTools').default;
    const {
        log
    } = require('../../util/DevTools').default;

    const {
        isPhoneGap
    } = require('../../util/Platform').default;

    // Actions
    const {
        EventActionsFactory
    } = require('../../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        stopProp
    } = EventActionsFactory({});

    const DateTools = DateToolsFactory({});

    /**********************************
     * Variables
     *********************************/

    const file_type_icon_map = {
        pdf: 'fa-file-pdf-o',
        ps: 'fa-file-pdf-o',

        txt: 'fa-file-text-o',

        doc: 'fa-file-word-o',
        docx: 'fa-file-word-o',
        odt: 'fa-file-word-o',
        rtf: 'fa-file-word-o',
        eml: 'fa-envelope-o',

        ppt: 'fa-file-powerpoint-o',
        pptx: 'fa-file-powerpoint-o',
        odp: 'fa-file-powerpoint-o',

        xls: 'fa-file-excel-o',
        xlsx: 'fa-file-excel-o',
        ods: 'fa-file-excel-o',

        mp3: 'fa-file-audio-o',
        wma: 'fa-file-audio-o',
        wav: 'fa-file-audio-o',

        png: 'fa-file-image-o',
        gif: 'fa-file-image-o',
        jpg: 'fa-file-image-o',
        bmp: 'fa-file-image-o',

        mp4: 'fa-file-video-o',
        mpg: 'fa-file-video-o',
        mpeg: 'fa-file-video-o',
        wmv: 'fa-file-video-o',
        mov: 'fa-file-video-o',
        avi: 'fa-file-video-o',
        vob: 'fa-file-video-o',

        zip: 'fa-file-archive-o',
        tgz: 'fa-file-archive-o',
        tar: 'fa-file-archive-o',
        rar: 'fa-file-archive-o',
        '7z': 'fa-file-archive-o'
    };

    /**********************************
     * Methods
     *********************************/

    let _buildAvatar;
    let _buildUserAndDate;
    let _fileDownloadHandler;
    let _getFileTypeIcon;

    /**
     *
     * @param inst
     * @returns {XML}
     * @private
     */
    _buildAvatar = (inst) => {
        const {file} = inst.props;

        return <Avatar><i className={`fa ${_getFileTypeIcon(file.get('originalfilename'))}`}/></Avatar>;
    };

    /**
     *
     * @param {object} spec
     * @property {Record} spec.record
     * @property {object} spec.inst
     * @property {object} spec.map
     * @private
     */
    _buildUserAndDate = (spec) => {
        const {
            record
        } = spec;

        const uploadedby = record.get('uploadedby');
        const postdate = record.get('postdate');

        return {
            'uploadInfo': {
                subHeading: `${DateTools.convertFromBalboaToDateString(postdate)} by ${uploadedby}`,
                iconClass: 'fa-calendar'
            }
        };
    };

    /**
     *
     * @param inst
     * @private
     */
    _fileDownloadHandler = (inst) => {
        const {
            file
        } = inst.props;

        const url = file.get('url');

        if (url && url.length) {
            if (isPhoneGap()) {
                window.open(url, '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');
            }
            else {
                window.open(file.get('url'), '_system');
            }
        }
    };

    /**
     *
     * @param {string} file_name
     * @return {string}
     */
    _getFileTypeIcon = (file_name) => {
        let parts = /\.[0-9a-z]+$/i.exec(file_name);
        let extension = ((parts && parts[0]) || '').replace(/\./, '').toLowerCase();
        return file_type_icon_map[extension] || 'fa-file-o';
    };

    /**********************************
     * Components
     *********************************/

    const ListCard = ListCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            file: PropTypes.object.isRequired,
            showDetails: PropTypes.bool
        },
        propsPriority: [
            'showDetails',
            'file'
        ]
    });

    const CardMixin = CardMixinFactory({
        fields: [{
            key: 'description',
            iconClass: ''
        }],
        additionalMapFunc: _buildUserAndDate
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    return createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'LibraryFileCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, CardMixin],
        /**
         * Generates HTML/DOM
         *
         * @return {XML|JSX}
         */
        render() {
            const {
                file,
                showDetails
            } = this.props;

            let subHeadingCollection;
            let limit = 3;

            let headingMap = this.buildHeadingMap({
                record: file,
                inst: this
            });

            if (showDetails) {
                limit = null;
            }

            subHeadingCollection = this.extractHeadings(headingMap, [
                'description',
                'uploadInfo'
            ], limit);

            let heading = '';
            if (subHeadingCollection && subHeadingCollection.length) {
                heading = subHeadingCollection[0].subHeading;
            }

            return <ListCard
                leftAvatar={_buildAvatar(this)}
                primaryText={heading}
                secondaryText={_.flatMap(subHeadingCollection.slice(1), (s) => {
                    return s.subHeading;
                })}
                onClick={(e) => {
                    stopProp(e);

                    _fileDownloadHandler(this);
                }}
            />;
        }
    });
}

export { LibraryFileCardFactory }