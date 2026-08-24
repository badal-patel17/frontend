// src/components/widget/Widget.jsx

import "./widget.scss";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import {
    AssessmentOutlined,
    ErrorOutline,
    SchemaOutlined,
    ReplayOutlined
} from "@mui/icons-material";

const WIDGET_META = {
    order: {
        title: "TOTAL ORDERS",
        icon: (
            <ShoppingCartOutlinedIcon
                className="icon"
                style={{ color: "#eeeeee" }}
            />
        )
    },

    earning: {
        title: "FAILED ORDERS",
        icon: (
            <SchemaOutlined
                className="icon"
                style={{ color: "#eeeeee" }}
            />
        )
    },

    balance: {
        title: "FALLOUTS",
        icon: (
            <AssessmentOutlined
                className="icon"
                style={{ color: "#eeeeee" }}
            />
        )
    },

    user: {
        title: "MANUAL REVIEW",
        icon: (
            <ErrorOutline
                className="icon"
                style={{ color: "#eeeeee" }}
            />
        )
    },

    compOrders: {
        title: "COMPLETED ORDERS",
        icon: (
            <ReplayOutlined
                className="icon"
                style={{ color: "#eeeeee" }}
            />
        )
    },

    inprogOrders: {
        title: "IN PROGRESS ORDERS",
        icon: (
            <ReplayOutlined
                className="icon"
                style={{ color: "#eeeeee" }}
            />
        )
    },

    cohort: {
        title: "ORDERS VOLUME",
        icon: (
            <ReplayOutlined
                className="icon"
                style={{ color: "#eeeeee" }}
            />
        )
    },

    flows: {
        title: "FLOWS",
        icon: (
            <ReplayOutlined
                className="icon"
                style={{ color: "#eeeeee" }}
            />
        )
    },

    fallouts: {
        title: "FALLOUTS",
        icon: (
            <ReplayOutlined
                className="icon"
                style={{ color: "#eeeeee" }}
            />
        )
    },

    fallout: {
        title: "FALLOUT",
        icon: (
            <ReplayOutlined
                className="icon"
                style={{ color: "#eeeeee" }}
            />
        )
    },
    successRate: {
        title: "SUCCESS RATE",
        icon: (
            <ReplayOutlined
                className="icon"
                style={{ color: "#eeeeee" }}
            />
        )
    }
};

const Widget = ({
                    type,
                    value = 0,
                    lastUpdated = "",
                    subtitle = ""
                }) => {
    const meta = WIDGET_META[type];

    if (!meta) {
        return null;
    }

    return (
        <div className={`widget ${type}`}>
            <div className="left">
        <span className="title">
          {meta.title}
        </span>

                <span className="counter">
          {value}
        </span>

                <span className="link">
          {subtitle || "Live backend value"}
        </span>

                {lastUpdated && (
                    <span className="updated">
            Updated {lastUpdated}
          </span>
                )}
            </div>

            <div className="right">
                {meta.icon}
            </div>
        </div>
    );
};

export default Widget;