import { Tabs } from "expo-router";

import { StatusBar } from "expo-status-bar";
import React from "react";
import { TAB_MENU } from "../../Constants/TabMenu";

const TabLayout = () => {
  return (
    <React.Fragment>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        {TAB_MENU.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.label,
              headerShown: false,
              tabBarIcon: ({ color, size }) => {
                const TabIcon = tab.icon;
                return <TabIcon color={color} size={size} />;
              },
            }}
          />
        ))}
      </Tabs>
    </React.Fragment>
  );
};

export default TabLayout;
