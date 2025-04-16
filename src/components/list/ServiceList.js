/**
 * Generates a ServiceList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const ServiceListFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    const MessageModel = require('../../stores/models/MessageModel').default;

    // Material UI
    const List = require('material-ui/List').List;
    const Divider = require('material-ui/Divider').default;

    // Actions
    const {
        TranslateActionsFactory
    } = require('../../actions');

    // Components
    const {
        MessageCardFactory,
        ServiceCardFactory,
        TotalCardFactory
    } = require('../cards');

    const {ViewHeaderFactory} = require('../ViewHeader');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {getText} = TranslateActionsFactory({});

    /**********************************
     * Components
     *********************************/

    const MessageCard = MessageCardFactory({});
    const ViewHeader = ViewHeaderFactory({});
    const ServiceCard = ServiceCardFactory({});
    const TotalCard = TotalCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'ServiceList',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        getInitialState() {
            return {};
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {event} = this.props;
            const modifiedEvent = event.get('modifiedEvent');
            const serviceList = modifiedEvent.get('Service');
            let serviceTotal = 0;

            return <List>
                <ViewHeader>{getText('Services')}</ViewHeader>

                {serviceList && serviceList.size === 0 ?
                    <MessageCard message={new MessageModel({
                        type: 'info',
                        text: getText('Tap the Add button below to create a new %1$s.', {
                            params: [getText('Service')]
                        })
                    })}/>
                    : null}

                {serviceList ? serviceList.map((service) => {
                    const fee = service.get('fee');

                    if (fee !== 'Free' || fee !== 'Actual' && fee && fee.length) {
                        serviceTotal += parseFloat(fee);
                    }

                    return <div key={`service-${service.get('id')}`}>
                        <ServiceCard
                            service={service}/>

                        <Divider/>
                    </div>;
                }) : null}

                {serviceList && serviceList.size ? <TotalCard total={serviceTotal}/> : null}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ServiceListFactory }