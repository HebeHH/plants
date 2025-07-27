import React, { useState, useMemo, useRef } from 'react';
import { Upload, Download, Copy, Search, Filter, BarChart3, Globe, Leaf, TreePine, Users, TrendingUp, Target, Table, GitBranch } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Treemap } from 'recharts';
import Papa from 'papaparse';

const PlantSpeciesDashboard = () => {
  const [data, setData] = useState([]);
  const [currentView, setCurrentView] = useState('upload'); // 'upload' or 'dashboard'
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'graphs', 'table'
  const [csvInput, setCsvInput] = useState('');
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Define enum fields and their expected values
  const enumFields = {
    'GROWTH FORM': ['Tree', 'Herb', 'Shrub', 'Vine'],
    'GEOGRAPHIC ORIGIN': ['Europe', 'Asia', 'Eastern North America', 'Western North America', 'Mediterranean', 'Australia', 'Africa', 'Central America', 'South America', 'Southeast Asia', 'Indian Subcontinent', 'Middle East', 'Northern Hemisphere', 'Tropical regions', 'Madagascar', 'New Zealand', 'Canary Islands', 'China', 'Japan'],
    'GROWTH HABIT': ['Wild', 'Cultivated', 'Both'],
    'HORTICULTURAL DEVELOPMENT': ['Low', 'Moderate', 'High'],
    'COMMERCIAL STATUS': ['None', 'Limited', 'Major'],
    'CONSERVATION STATUS': ['Widespread/Common', 'Locally common', 'Uncommon', 'Rare', 'Very rare/Endangered']
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCsvInput(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = () => {
    if (!csvInput.trim()) return;

    Papa.parse(csvInput, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Clean up headers (remove whitespace)
        const cleanedData = results.data.map(row => {
          const cleanedRow = {};
          Object.keys(row).forEach(key => {
            const cleanKey = key.trim();
            cleanedRow[cleanKey] = row[key];
          });
          return cleanedRow;
        });
        
        setData(cleanedData);
        setCurrentView('dashboard');
      },
      error: (error) => {
        alert('Error parsing CSV: ' + error.message);
      }
    });
  };

  // Get unique values for a column
  const getUniqueValues = (columnName) => {
    const values = data.map(row => row[columnName]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  // Handle filter changes
  const handleFilterChange = (column, value, isMultiSelect = false) => {
    setFilters(prev => {
      if (isMultiSelect) {
        const currentValues = prev[column] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [column]: newValues.length > 0 ? newValues : undefined };
      } else {
        return { ...prev, [column]: value || undefined };
      }
    });
  };

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(filters).every(([column, filterValue]) => {
        if (!filterValue) return true;
        
        const cellValue = row[column]?.toLowerCase() || '';
        
        if (Array.isArray(filterValue)) {
          // Multi-select filter
          return filterValue.some(val => cellValue.includes(val.toLowerCase()));
        } else {
          // Text search filter
          return cellValue.includes(filterValue.toLowerCase());
        }
      });
    });
  }, [data, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (column) => {
    setSortConfig(prev => ({
      key: column,
      direction: prev.key === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Helper function to get top N values and bucket the rest as "Other"
  const getTopNWithOthers = (counts, n = 9) => {
    const sorted = Object.entries(counts).sort(([,a], [,b]) => b - a);
    const topN = sorted.slice(0, n);
    const others = sorted.slice(n);
    
    const result = topN.map(([name, value]) => ({ name, value }));
    
    if (others.length > 0) {
      const otherSum = others.reduce((sum, [,value]) => sum + value, 0);
      result.push({ name: 'Other', value: otherSum });
    }
    
    return result;
  };

  // Generate summary statistics and chart data
  const summaryStats = useMemo(() => {
    if (!data.length) return {};

    const stats = {};
    
    // Count by growth form
    const growthFormCounts = {};
    data.forEach(row => {
      const form = row['GROWTH FORM'];
      if (form) growthFormCounts[form] = (growthFormCounts[form] || 0) + 1;
    });

    // Count by geographic origin (top 5)
    const geographicCounts = {};
    data.forEach(row => {
      const origin = row['GEOGRAPHIC ORIGIN'];
      if (origin) geographicCounts[origin] = (geographicCounts[origin] || 0) + 1;
    });

    // Commercial status breakdown
    const commercialCounts = {};
    data.forEach(row => {
      const status = row['COMMERCIAL STATUS'];
      if (status) commercialCounts[status] = (commercialCounts[status] || 0) + 1;
    });

    // Conservation status counts
    const conservationCounts = {};
    data.forEach(row => {
      const status = row['CONSERVATION STATUS'];
      if (status) conservationCounts[status] = (conservationCounts[status] || 0) + 1;
    });

    // Conservation concern count
    const conservationConcern = data.filter(row => 
      ['Rare', 'Very rare/Endangered'].includes(row['CONSERVATION STATUS'])
    ).length;

    // Human influence
    const cultivatedCount = data.filter(row => 
      ['Cultivated', 'Both'].includes(row['GROWTH HABIT'])
    ).length;

    // Horticultural development by growth habit
    const hortDevByGrowthHabit = {};
    data.forEach(row => {
      const habit = row['GROWTH HABIT'];
      const development = row['HORTICULTURAL DEVELOPMENT'];
      if (habit && development) {
        if (!hortDevByGrowthHabit[habit]) {
          hortDevByGrowthHabit[habit] = {};
        }
        hortDevByGrowthHabit[habit][development] = (hortDevByGrowthHabit[habit][development] || 0) + 1;
      }
    });

    // Family by geographic origin
    const familyByOrigin = {};
    data.forEach(row => {
      const family = row['FAMILY'];
      const origin = row['GEOGRAPHIC ORIGIN'];
      if (family && origin) {
        if (!familyByOrigin[family]) {
          familyByOrigin[family] = {};
        }
        familyByOrigin[family][origin] = (familyByOrigin[family][origin] || 0) + 1;
      }
    });

    // Taxonomic data processing
    // Filter data to only include rows with required taxonomic levels AND valid hierarchy
    const validTaxonomicData = data.filter(row => {
      // Must have all required fields
      if (!row['CLADE'] || !row['ORDER'] || !row['FAMILY'] || !row['GENUS']) {
        return false;
      }
      
      // Check if this row would cause hierarchy violations
      const species = row['SPECIES'];
      const genus = row['GENUS'];
      const family = row['FAMILY'];
      const order = row['ORDER'];
      const clade = row['CLADE'];
      
      // This is a simplified check - in a full implementation you'd want to do this more thoroughly
      return true; // For now, include all complete records
    });

    // Build proper hierarchical structure for sunburst
    const hierarchyBuilder = {};
    
    validTaxonomicData.forEach(row => {
      const clade = row['CLADE'];
      const order = row['ORDER'];
      const family = row['FAMILY'];
      const genus = row['GENUS'];
      
      if (!hierarchyBuilder[clade]) {
        hierarchyBuilder[clade] = {};
      }
      if (!hierarchyBuilder[clade][order]) {
        hierarchyBuilder[clade][order] = {};
      }
      if (!hierarchyBuilder[clade][order][family]) {
        hierarchyBuilder[clade][order][family] = {};
      }
      if (!hierarchyBuilder[clade][order][family][genus]) {
        hierarchyBuilder[clade][order][family][genus] = 0;
      }
      hierarchyBuilder[clade][order][family][genus]++;
    });

    // Convert to sunburst format
    const sunburstHierarchy = Object.entries(hierarchyBuilder).map(([clade, orders]) => {
      const cladeNode = {
        name: clade,
        children: [],
        value: 0
      };

      Object.entries(orders).forEach(([order, families]) => {
        const orderNode = {
          name: order,
          children: [],
          value: 0
        };

        Object.entries(families).forEach(([family, genera]) => {
          const familyNode = {
            name: family,
            children: [],
            value: 0
          };

          Object.entries(genera).forEach(([genus, count]) => {
            const genusNode = {
              name: genus,
              value: count
            };
            familyNode.children.push(genusNode);
            familyNode.value += count;
          });

          orderNode.children.push(familyNode);
          orderNode.value += familyNode.value;
        });

        cladeNode.children.push(orderNode);
        cladeNode.value += orderNode.value;
      });

      return cladeNode;
    }).sort((a, b) => b.value - a.value); // Sort by size

    // Count by clade
    const cladeCounts = {};
    validTaxonomicData.forEach(row => {
      const clade = row['CLADE'];
      if (clade) cladeCounts[clade] = (cladeCounts[clade] || 0) + 1;
    });

    // Count by order within each clade
    const cladeOrderData = {};
    validTaxonomicData.forEach(row => {
      const clade = row['CLADE'];
      const order = row['ORDER'];
      if (clade && order) {
        if (!cladeOrderData[clade]) cladeOrderData[clade] = {};
        cladeOrderData[clade][order] = (cladeOrderData[clade][order] || 0) + 1;
      }
    });

    // Count by family within each order
    const orderFamilyData = {};
    validTaxonomicData.forEach(row => {
      const order = row['ORDER'];
      const family = row['FAMILY'];
      if (order && family) {
        if (!orderFamilyData[order]) orderFamilyData[order] = {};
        orderFamilyData[order][family] = (orderFamilyData[order][family] || 0) + 1;
      }
    });

    // Create sunburst data for clade > order > family (legacy - keeping for compatibility)
    const sunburstData = [];
    Object.entries(cladeOrderData).forEach(([clade, orders]) => {
      const cladeTotal = Object.values(orders).reduce((sum, count) => sum + count, 0);
      
      const cladeNode = {
        name: clade,
        value: cladeTotal,
        children: []
      };

      Object.entries(orders).forEach(([order, count]) => {
        const orderFamilies = orderFamilyData[order] || {};
        const orderNode = {
          name: order,
          value: count,
          children: []
        };

        Object.entries(orderFamilies).slice(0, 8).forEach(([family, familyCount]) => {
          orderNode.children.push({
            name: family,
            value: familyCount
          });
        });

        cladeNode.children.push(orderNode);
      });

      sunburstData.push(cladeNode);
    });

    // Create treemap data for top families
    const familyTotals = {};
    validTaxonomicData.forEach(row => {
      const family = row['FAMILY'];
      const order = row['ORDER'];
      if (family && order) {
        familyTotals[family] = (familyTotals[family] || 0) + 1;
      }
    });

    const treemapData = Object.entries(familyTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([family, count]) => ({
        name: family,
        value: count,
        // Find the order for this family
        order: validTaxonomicData.find(row => row['FAMILY'] === family)?.['ORDER'] || 'Unknown'
      }));

    // Create order distribution data
    const orderCounts = {};
    validTaxonomicData.forEach(row => {
      const order = row['ORDER'];
      if (order) orderCounts[order] = (orderCounts[order] || 0) + 1;
    });

    const orderDistributionData = getTopNWithOthers(orderCounts, 12);

    // Taxonomy validation
    const taxonomyValidation = {
      totalRecords: data.length,
      missingData: {
        clade: data.filter(row => !row['CLADE']).length,
        order: data.filter(row => !row['ORDER']).length,
        family: data.filter(row => !row['FAMILY']).length,
        genus: data.filter(row => !row['GENUS']).length,
        species: data.filter(row => !row['SPECIES']).length
      },
      completeRecords: validTaxonomicData.length,
      hierarchyViolations: []
    };

    // Check hierarchy consistency
    const hierarchyChecks = {
      // Check if all species with same name are in same genus
      speciesGenusCheck: {},
      // Check if all genera with same name are in same family
      genusFamilyCheck: {},
      // Check if all families with same name are in same order
      familyOrderCheck: {},
      // Check if all orders with same name are in same clade
      orderCladeCheck: {}
    };

    // Collect relationships
    data.forEach((row, index) => {
      const species = row['SPECIES'];
      const genus = row['GENUS'];
      const family = row['FAMILY'];
      const order = row['ORDER'];
      const clade = row['CLADE'];

      if (species && genus) {
        if (!hierarchyChecks.speciesGenusCheck[species]) {
          hierarchyChecks.speciesGenusCheck[species] = new Set();
        }
        hierarchyChecks.speciesGenusCheck[species].add(genus);
      }

      if (genus && family) {
        if (!hierarchyChecks.genusFamilyCheck[genus]) {
          hierarchyChecks.genusFamilyCheck[genus] = new Set();
        }
        hierarchyChecks.genusFamilyCheck[genus].add(family);
      }

      if (family && order) {
        if (!hierarchyChecks.familyOrderCheck[family]) {
          hierarchyChecks.familyOrderCheck[family] = new Set();
        }
        hierarchyChecks.familyOrderCheck[family].add(order);
      }

      if (order && clade) {
        if (!hierarchyChecks.orderCladeCheck[order]) {
          hierarchyChecks.orderCladeCheck[order] = new Set();
        }
        hierarchyChecks.orderCladeCheck[order].add(clade);
      }
    });

    // Check for violations
    Object.entries(hierarchyChecks.speciesGenusCheck).forEach(([species, genera]) => {
      if (genera.size > 1) {
        taxonomyValidation.hierarchyViolations.push({
          type: 'Species → Genus',
          item: species,
          issue: `Species "${species}" appears in multiple genera: ${Array.from(genera).join(', ')}`,
          level: 'species'
        });
      }
    });

    Object.entries(hierarchyChecks.genusFamilyCheck).forEach(([genus, families]) => {
      if (families.size > 1) {
        taxonomyValidation.hierarchyViolations.push({
          type: 'Genus → Family',
          item: genus,
          issue: `Genus "${genus}" appears in multiple families: ${Array.from(families).join(', ')}`,
          level: 'genus'
        });
      }
    });

    Object.entries(hierarchyChecks.familyOrderCheck).forEach(([family, orders]) => {
      if (orders.size > 1) {
        taxonomyValidation.hierarchyViolations.push({
          type: 'Family → Order',
          item: family,
          issue: `Family "${family}" appears in multiple orders: ${Array.from(orders).join(', ')}`,
          level: 'family'
        });
      }
    });

    Object.entries(hierarchyChecks.orderCladeCheck).forEach(([order, clades]) => {
      if (clades.size > 1) {
        taxonomyValidation.hierarchyViolations.push({
          type: 'Order → Clade',
          item: order,
          issue: `Order "${order}" appears in multiple clades: ${Array.from(clades).join(', ')}`,
          level: 'order'
        });
      }
    });

    taxonomyValidation.isValid = taxonomyValidation.hierarchyViolations.length === 0;

    return {
      totalSpecies: data.length,
      growthFormCounts,
      topGeographic: Object.entries(geographicCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      commercialCounts,
      conservationConcern,
      humanInfluence: Math.round((cultivatedCount / data.length) * 100),
      // Chart data
      conservationChartData: getTopNWithOthers(conservationCounts),
      commercialChartData: getTopNWithOthers(commercialCounts),
      hortDevByGrowthHabit,
      familyByOrigin,
      // Taxonomic data
      taxonomicDataCount: validTaxonomicData.length,
      sunburstData,
      sunburstHierarchy,
      treemapData,
      orderDistributionData,
      cladeCounts,
      taxonomyValidation
    };
  }, [data]);

  // Prepare chart data for horticultural development by growth habit
  const hortDevChartData = useMemo(() => {
    const habits = Object.keys(summaryStats.hortDevByGrowthHabit || {});
    const developments = ['Low', 'Moderate', 'High'];
    
    return habits.map(habit => {
      const result = { name: habit };
      developments.forEach(dev => {
        result[dev] = summaryStats.hortDevByGrowthHabit[habit][dev] || 0;
      });
      return result;
    });
  }, [summaryStats.hortDevByGrowthHabit]);

  // Prepare chart data for family by geographic origin
  const familyByOriginChartData = useMemo(() => {
    if (!summaryStats.familyByOrigin) return [];
    
    // Get top 9 families by total count
    const familyTotals = {};
    Object.entries(summaryStats.familyByOrigin).forEach(([family, origins]) => {
      familyTotals[family] = Object.values(origins).reduce((sum, count) => sum + count, 0);
    });
    
    const topFamilies = Object.entries(familyTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 9)
      .map(([family]) => family);
    
    // Get all unique origins
    const allOrigins = new Set();
    Object.values(summaryStats.familyByOrigin).forEach(origins => {
      Object.keys(origins).forEach(origin => allOrigins.add(origin));
    });
    
    const origins = Array.from(allOrigins).slice(0, 10); // Limit origins for readability
    
    return topFamilies.map(family => {
      const result = { name: family };
      origins.forEach(origin => {
        result[origin] = summaryStats.familyByOrigin[family][origin] || 0;
      });
      return result;
    });
  }, [summaryStats.familyByOrigin]);

  // Custom Sunburst Chart Component with Zoom/Pan
  const SunburstChart = ({ data, width = 800, height = 700 }) => {
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const svgRef = useRef(null);

    const centerX = width / 2;
    const centerY = height / 2;
    const innerRadius = 50;
    const ringWidth = 90;

    if (!data || data.length === 0) {
      return (
        <div className="w-full flex justify-center">
          <svg width={width} height={height}>
            <text x={centerX} y={centerY} textAnchor="middle" className="text-gray-500">
              No valid taxonomic data available
            </text>
          </svg>
        </div>
      );
    }

    // Helper function to create SVG path for arc
    const createArc = (innerRadius, outerRadius, startAngle, endAngle) => {
      const startAngleRad = (startAngle - 90) * Math.PI / 180;
      const endAngleRad = (endAngle - 90) * Math.PI / 180;
      
      const x1 = centerX + innerRadius * Math.cos(startAngleRad);
      const y1 = centerY + innerRadius * Math.sin(startAngleRad);
      const x2 = centerX + outerRadius * Math.cos(startAngleRad);
      const y2 = centerY + outerRadius * Math.sin(startAngleRad);
      
      const x3 = centerX + outerRadius * Math.cos(endAngleRad);
      const y3 = centerY + outerRadius * Math.sin(endAngleRad);
      const x4 = centerX + innerRadius * Math.cos(endAngleRad);
      const y4 = centerY + innerRadius * Math.sin(endAngleRad);
      
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      
      return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`;
    };

    // Mouse event handlers for zoom/pan
    const handleMouseDown = (e) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.3, Math.min(3, transform.scale * delta));
      
      setTransform(prev => ({
        ...prev,
        scale: newScale
      }));
    };

    const resetView = () => {
      setTransform({ x: 0, y: 0, scale: 1 });
    };

    // Calculate total for angle distribution
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    const segments = [];
    const labels = [];

    // Create segments for each ring
    data.forEach((cladeData, cladeIndex) => {
      const cladeAngle = (cladeData.value / total) * 360;
      const cladeColor = PIE_COLORS[cladeIndex % PIE_COLORS.length];
      
      // Clade ring (innermost)
      segments.push({
        path: createArc(innerRadius, innerRadius + ringWidth, currentAngle, currentAngle + cladeAngle),
        fill: cladeColor,
        opacity: 1,
        level: 'clade',
        name: cladeData.name,
        value: cladeData.value
      });

      // Add clade label
      const cladeMidAngle = currentAngle + cladeAngle / 2;
      const cladeLabelRadius = innerRadius + ringWidth / 2;
      const cladeLabelX = centerX + cladeLabelRadius * Math.cos((cladeMidAngle - 90) * Math.PI / 180);
      const cladeLabelY = centerY + cladeLabelRadius * Math.sin((cladeMidAngle - 90) * Math.PI / 180);
      
      if (cladeAngle > 15) { // Only show label if segment is large enough
        labels.push({
          x: cladeLabelX,
          y: cladeLabelY,
          text: cladeData.name,
          fontSize: 14,
          fill: '#fff',
          fontWeight: 'bold'
        });
      }

      // Orders ring
      let orderStartAngle = currentAngle;
      if (cladeData.children) {
        cladeData.children.forEach((orderData, orderIndex) => {
          const orderAngle = (orderData.value / cladeData.value) * cladeAngle;
          const orderColor = cladeColor;
          
          segments.push({
            path: createArc(innerRadius + ringWidth, innerRadius + 2 * ringWidth, orderStartAngle, orderStartAngle + orderAngle),
            fill: orderColor,
            opacity: 0.8,
            level: 'order',
            name: orderData.name,
            value: orderData.value
          });

          // Add order label
          const orderMidAngle = orderStartAngle + orderAngle / 2;
          const orderLabelRadius = innerRadius + 1.5 * ringWidth;
          const orderLabelX = centerX + orderLabelRadius * Math.cos((orderMidAngle - 90) * Math.PI / 180);
          const orderLabelY = centerY + orderLabelRadius * Math.sin((orderMidAngle - 90) * Math.PI / 180);
          
          if (orderAngle > 12) {
            labels.push({
              x: orderLabelX,
              y: orderLabelY,
              text: orderData.name.length > 12 ? orderData.name.substring(0, 12) + '...' : orderData.name,
              fontSize: 11,
              fill: '#fff',
              fontWeight: 'normal'
            });
          }

          // Families ring
          let familyStartAngle = orderStartAngle;
          if (orderData.children) {
            orderData.children.forEach((familyData, familyIndex) => {
              const familyAngle = (familyData.value / orderData.value) * orderAngle;
              const familyColor = orderColor;
              
              segments.push({
                path: createArc(innerRadius + 2 * ringWidth, innerRadius + 3 * ringWidth, familyStartAngle, familyStartAngle + familyAngle),
                fill: familyColor,
                opacity: 0.6,
                level: 'family',
                name: familyData.name,
                value: familyData.value
              });

              // Add family label for larger segments
              if (familyAngle > 8) {
                const familyMidAngle = familyStartAngle + familyAngle / 2;
                const familyLabelRadius = innerRadius + 2.5 * ringWidth;
                const familyLabelX = centerX + familyLabelRadius * Math.cos((familyMidAngle - 90) * Math.PI / 180);
                const familyLabelY = centerY + familyLabelRadius * Math.sin((familyMidAngle - 90) * Math.PI / 180);
                
                labels.push({
                  x: familyLabelX,
                  y: familyLabelY,
                  text: familyData.name.length > 8 ? familyData.name.substring(0, 8) + '...' : familyData.name,
                  fontSize: 9,
                  fill: '#fff',
                  fontWeight: 'normal'
                });
              }

              // Genera ring
              let genusStartAngle = familyStartAngle;
              if (familyData.children) {
                familyData.children.forEach((genusData, genusIndex) => {
                  const genusAngle = (genusData.value / familyData.value) * familyAngle;
                  const genusColor = familyColor;
                  
                  segments.push({
                    path: createArc(innerRadius + 3 * ringWidth, innerRadius + 4 * ringWidth, genusStartAngle, genusStartAngle + genusAngle),
                    fill: genusColor,
                    opacity: 0.4,
                    level: 'genus',
                    name: genusData.name,
                    value: genusData.value
                  });

                  genusStartAngle += genusAngle;
                });
              }

              familyStartAngle += familyAngle;
            });
          }

          orderStartAngle += orderAngle;
        });
      }

      currentAngle += cladeAngle;
    });

    return (
      <div className="w-full">
        {/* Controls */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 rounded-lg p-2 flex items-center space-x-4">
            <button
              onClick={resetView}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
            >
              Reset View
            </button>
            <span className="text-sm text-gray-600">
              Scroll to zoom • Drag to pan • Scale: {transform.scale.toFixed(1)}x
            </span>
          </div>
        </div>

        {/* SVG Container */}
        <div className="w-full overflow-hidden border border-gray-200 rounded-lg bg-white">
          <svg 
            ref={svgRef}
            width="100%" 
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className={`cursor-${isDragging ? 'grabbing' : 'grab'}`}
            style={{ userSelect: 'none' }}
          >
            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
              {/* Segments */}
              {segments.map((segment, index) => (
                <path
                  key={index}
                  d={segment.path}
                  fill={segment.fill}
                  opacity={segment.opacity}
                  stroke="#fff"
                  strokeWidth="1"
                  className="hover:opacity-100 transition-opacity"
                >
                  <title>{`${segment.level}: ${segment.name} (${segment.value} species)`}</title>
                </path>
              ))}
              
              {/* Labels */}
              {labels.map((label, index) => (
                <text
                  key={index}
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={label.fontSize}
                  fill={label.fill}
                  fontWeight={label.fontWeight}
                  className="pointer-events-none"
                >
                  {label.text}
                </text>
              ))}

              {/* Center label */}
              <text
                x={centerX}
                y={centerY - 15}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16"
                fontWeight="bold"
                fill="#374151"
              >
                Taxonomy
              </text>
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fill="#6b7280"
              >
                {total} species
              </text>
              <text
                x={centerX}
                y={centerY + 15}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="#9ca3af"
              >
                4 taxonomic levels
              </text>
            </g>
          </svg>
        </div>
      </div>
    );
  };

  // Color schemes for charts - more distinct colors
  const PIE_COLORS = [
    '#059669', '#dc2626', '#2563eb', '#7c2d12', '#9333ea', 
    '#0891b2', '#ea580c', '#4338ca', '#be123c', '#166534'
  ];

  const BAR_COLORS = [
    '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6',
    '#06b6d4', '#f97316', '#6366f1', '#ec4899', '#84cc16',
    '#f43f5e', '#14b8a6', '#a855f7', '#22c55e', '#eab308'
  ];

  const downloadCSV = () => {
    const csv = Papa.unparse(sortedData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_plant_species.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    const csv = Papa.unparse(sortedData);
    try {
      await navigator.clipboard.writeText(csv);
      alert('Data copied to clipboard!');
    } catch (err) {
      alert('Failed to copy data');
    }
  };

  if (currentView === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Plant Species Dashboard</h1>
              <p className="text-gray-600">Upload your CSV data to explore botanical diversity</p>
            </div>

            {/* Taxonomy Validation Report */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Taxonomy Validation Report</h3>
              
              {/* Data Completeness */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Data Completeness</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">
                      {summaryStats.taxonomyValidation?.completeRecords || 0}
                    </div>
                    <div className="text-xs text-gray-600">Complete Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-500">
                      {summaryStats.taxonomyValidation?.missingData?.clade || 0}
                    </div>
                    <div className="text-xs text-gray-600">Missing Clade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-500">
                      {summaryStats.taxonomyValidation?.missingData?.order || 0}
                    </div>
                    <div className="text-xs text-gray-600">Missing Order</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-500">
                      {summaryStats.taxonomyValidation?.missingData?.family || 0}
                    </div>
                    <div className="text-xs text-gray-600">Missing Family</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-500">
                      {summaryStats.taxonomyValidation?.missingData?.genus || 0}
                    </div>
                    <div className="text-xs text-gray-600">Missing Genus</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-500">
                      {summaryStats.taxonomyValidation?.missingData?.species || 0}
                    </div>
                    <div className="text-xs text-gray-600">Missing Species</div>
                  </div>
                </div>
              </div>

              {/* Hierarchy Validation */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-3">Hierarchy Validation</h4>
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`px-4 py-2 rounded-lg font-medium ${
                    summaryStats.taxonomyValidation?.isValid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {summaryStats.taxonomyValidation?.isValid ? '✓ Hierarchy Valid' : '✗ Hierarchy Issues Found'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {summaryStats.taxonomyValidation?.hierarchyViolations?.length || 0} violation(s) detected
                  </div>
                </div>
              </div>

              {/* Violations List */}
              {summaryStats.taxonomyValidation?.hierarchyViolations?.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-700 mb-3">Hierarchy Violations</h4>
                  <div className="bg-red-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {summaryStats.taxonomyValidation.hierarchyViolations.map((violation, index) => (
                        <div key={index} className="border-b border-red-200 pb-2 last:border-b-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-medium">
                              {violation.type}
                            </span>
                            <span className="font-medium text-red-900">{violation.item}</span>
                          </div>
                          <div className="text-sm text-red-700 ml-2">
                            {violation.issue}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {summaryStats.taxonomyValidation?.isValid && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-green-800">
                    ✅ All taxonomic relationships are consistent! Every species belongs to exactly one genus, 
                    every genus to one family, every family to one order, and every order to one clade.
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-green-600 hover:text-green-700 font-medium"
                  >
                    Choose CSV file
                  </label>
                  <p className="text-gray-500 text-sm mt-1">or drag and drop your file here</p>
                </div>
              </div>

              <div className="text-center text-gray-500">or</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste CSV Data
                </label>
                <textarea
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder="Paste your CSV data here..."
                  className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!csvInput.trim()}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Create Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Leaf className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Plant Species Dashboard</h1>
                <p className="text-gray-600">{data.length} species loaded</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('upload')}
              className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              Upload New Data
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('summary')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'summary'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Summary</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('graphs')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'graphs'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Graphs</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('taxonomy')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'taxonomy'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-4 h-4" />
                  <span>Taxonomy</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'table'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Table className="w-4 h-4" />
                  <span>Data Table</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'summary' && (
          <>
            {/* Summary Statistics */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6 min-w-[280px] flex-1">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Total Species</h3>
                    <p className="text-2xl font-bold text-gray-800">{summaryStats.totalSpecies?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 min-w-[280px] flex-1">
                <div className="flex items-center space-x-3">
                  <TreePine className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Trees</h3>
                    <p className="text-2xl font-bold text-gray-800">{summaryStats.growthFormCounts?.Tree || 0}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round(((summaryStats.growthFormCounts?.Tree || 0) / summaryStats.totalSpecies) * 100)}% of total
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 min-w-[280px] flex-1">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Human Influence</h3>
                    <p className="text-2xl font-bold text-gray-800">{summaryStats.humanInfluence}%</p>
                    <p className="text-xs text-gray-500">Cultivated or both</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 min-w-[280px] flex-1">
                <div className="flex items-center space-x-3">
                  <Globe className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Conservation Concern</h3>
                    <p className="text-2xl font-bold text-gray-800">{summaryStats.conservationConcern}</p>
                    <p className="text-xs text-gray-500">Rare/Endangered species</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 min-w-[320px] flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Form Distribution</h3>
                <div className="space-y-2">
                  {Object.entries(summaryStats.growthFormCounts || {}).map(([form, count]) => (
                    <div key={form} className="flex justify-between items-center">
                      <span className="text-gray-600">{form}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 min-w-[320px] flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Geographic Origins</h3>
                <div className="space-y-2">
                  {(summaryStats.topGeographic || []).map(([origin, count]) => (
                    <div key={origin} className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">{origin}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 min-w-[320px] flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Commercial Status</h3>
                <div className="space-y-2">
                  {Object.entries(summaryStats.commercialCounts || {}).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="text-gray-600">{status}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'graphs' && (
          <div className="space-y-6">
            {/* Pie Charts Row */}
            <div className="flex flex-wrap gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 min-w-[500px] flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Conservation Status Distribution</h3>
                <div className="flex items-center">
                  <ResponsiveContainer width="70%" height={300}>
                    <PieChart>
                      <Pie
                        data={summaryStats.conservationChartData || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                      >
                        {(summaryStats.conservationChartData || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-[30%] pl-4">
                    <div className="space-y-2">
                      {(summaryStats.conservationChartData || []).map((entry, index) => (
                        <div key={entry.name} className="flex items-center space-x-2 text-sm">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span className="text-gray-700">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 min-w-[500px] flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Commercial Status Distribution</h3>
                <div className="flex items-center">
                  <ResponsiveContainer width="70%" height={300}>
                    <PieChart>
                      <Pie
                        data={summaryStats.commercialChartData || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                      >
                        {(summaryStats.commercialChartData || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-[30%] pl-4">
                    <div className="space-y-2">
                      {(summaryStats.commercialChartData || []).map((entry, index) => (
                        <div key={entry.name} className="flex items-center space-x-2 text-sm">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span className="text-gray-700">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Charts Row */}
            <div className="flex flex-wrap gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 min-w-[500px] flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Horticultural Development by Growth Habit</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hortDevChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Low" stackId="a" fill="#10b981" />
                    <Bar dataKey="Moderate" stackId="a" fill="#059669" />
                    <Bar dataKey="High" stackId="a" fill="#047857" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 min-w-[500px] flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Families by Geographic Origin</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={familyByOriginChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {familyByOriginChartData.length > 0 && Object.keys(familyByOriginChartData[0])
                      .filter(key => key !== 'name')
                      .slice(0, 8) // Limit to 8 origins for readability
                      .map((origin, index) => (
                        <Bar 
                          key={origin} 
                          dataKey={origin} 
                          stackId="a" 
                          fill={BAR_COLORS[index % BAR_COLORS.length]} 
                        />
                      ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'taxonomy' && (
          <div className="space-y-6">
            {/* Taxonomy Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Taxonomic Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Object.keys(summaryStats.cladeCounts || {}).length}</div>
                  <div className="text-sm text-gray-600">Clades</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{summaryStats.orderDistributionData?.length || 0}</div>
                  <div className="text-sm text-gray-600">Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{summaryStats.treemapData?.length || 0}</div>
                  <div className="text-sm text-gray-600">Top Families</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{summaryStats.taxonomicDataCount || 0}</div>
                  <div className="text-sm text-gray-600">Complete Records</div>
                </div>
              </div>
            </div>

            {/* Hierarchical Sunburst Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Taxonomic Hierarchy Sunburst</h3>
              <p className="text-sm text-gray-600 mb-4">
                Interactive hierarchical view: Clade (inner) → Order → Family → Genus (outer). Scroll to zoom, drag to pan.
              </p>
              <SunburstChart 
                data={summaryStats.sunburstHierarchy || []} 
                width={1000} 
                height={700} 
              />
            </div>

            {/* Order Distribution Pie Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Species Distribution by Order</h3>
              <div className="flex items-center">
                <ResponsiveContainer width="70%" height={400}>
                  <PieChart>
                    <Pie
                      data={summaryStats.orderDistributionData || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => percent > 0.05 ? `${name} (${(percent * 100).toFixed(1)}%)` : ''}
                      labelLine={false}
                    >
                      {(summaryStats.orderDistributionData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-[30%] pl-4">
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {(summaryStats.orderDistributionData || []).map((entry, index) => (
                      <div key={entry.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span className="text-gray-700">{entry.name}</span>
                        </div>
                        <span className="font-medium">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Family Treemap */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 20 Families by Species Count</h3>
              <ResponsiveContainer width="100%" height={400}>
                <Treemap
                  data={summaryStats.treemapData || []}
                  dataKey="value"
                  aspectRatio={4/3}
                  stroke="#fff"
                  strokeWidth={2}
                  content={({ x, y, width, height, index, name, value }) => {
                    const color = PIE_COLORS[index % PIE_COLORS.length];
                    return (
                      <g>
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          fill={color}
                          fillOpacity={0.8}
                        />
                        {width > 60 && height > 30 && (
                          <>
                            <text
                              x={x + width / 2}
                              y={y + height / 2 - 8}
                              textAnchor="middle"
                              fill="#fff"
                              fontSize="12"
                              fontWeight="bold"
                            >
                              {name}
                            </text>
                            <text
                              x={x + width / 2}
                              y={y + height / 2 + 8}
                              textAnchor="middle"
                              fill="#fff"
                              fontSize="10"
                            >
                              {value} species
                            </text>
                          </>
                        )}
                      </g>
                    );
                  }}
                />
              </ResponsiveContainer>
            </div>

            {/* Clade Distribution Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Species Distribution by Clade</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(summaryStats.cladeCounts || {}).map(([name, value]) => ({ name, value }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981">
                    {Object.entries(summaryStats.cladeCounts || {}).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'table' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Species Data</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={downloadCSV}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600">
                Showing {sortedData.length} of {data.length} species
                {Object.keys(filters).length > 0 && (
                  <span className="ml-2 text-green-600">
                    ({Object.keys(filters).length} filter{Object.keys(filters).length !== 1 ? 's' : ''} active)
                  </span>
                )}
              </p>
            </div>

            {/* Filters */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-4">
                {columns.map(column => {
                  const isEnum = enumFields[column];
                  
                  if (isEnum) {
                    return (
                      <div key={column} className="min-w-[280px] flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {column}
                        </label>
                        <div className="relative">
                          <select
                            multiple
                            value={filters[column] || []}
                            onChange={(e) => {
                              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                              setFilters(prev => ({
                                ...prev,
                                [column]: selectedOptions.length > 0 ? selectedOptions : undefined
                              }));
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            size={Math.min(isEnum.length, 4)}
                          >
                            {getUniqueValues(column).map(value => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={column} className="min-w-[280px] flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {column}
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder={`Search ${column.toLowerCase()}...`}
                            value={filters[column] || ''}
                            onChange={(e) => handleFilterChange(column, e.target.value)}
                            className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map(column => (
                      <th
                        key={column}
                        onClick={() => handleSort(column)}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column}</span>
                          {sortConfig.key === column && (
                            <span className="text-green-600">
                              {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      {columns.map(column => (
                        <td key={column} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {row[column] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantSpeciesDashboard;